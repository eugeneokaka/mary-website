import { internalMutation, mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { requireAuthor } from "./auth";

const MAX_VIEWER_ID_LENGTH = 64;
const MIN_READ_MS = 5_000;
const MAX_READ_MS = 30 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_RANGE_DAYS = 2000;

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function dayKey(timestamp = Date.now()): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function isValidDay(day: string): boolean {
  return DAY_PATTERN.test(day) && Number.isFinite(Date.parse(`${day}T00:00:00.000Z`));
}

function dayStartMs(day: string): number {
  return Date.parse(`${day}T00:00:00.000Z`);
}

function eachDay(fromDay: string, toDay: string): string[] {
  if (!isValidDay(fromDay) || !isValidDay(toDay)) return [];
  const start = dayStartMs(fromDay);
  const end = dayStartMs(toDay);
  if (end < start) return [];

  const days: string[] = [];
  for (let t = start; t <= end && days.length < MAX_RANGE_DAYS; t += DAY_MS) {
    days.push(new Date(t).toISOString().slice(0, 10));
  }
  return days;
}

function isValidViewerId(viewerId: string): boolean {
  return viewerId.length > 0 && viewerId.length <= MAX_VIEWER_ID_LENGTH;
}

type DailyIncrements = {
  views?: number;
  uniqueViews?: number;
  downloads?: number;
  readMs?: number;
  readCount?: number;
};

async function bumpDaily(
  ctx: MutationCtx,
  postId: Id<"blogs">,
  day: string,
  increments: DailyIncrements,
): Promise<void> {
  const existing = await ctx.db
    .query("postStatsDaily")
    .withIndex("by_post_day", (q) => q.eq("postId", postId).eq("day", day))
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      views: existing.views + (increments.views ?? 0),
      uniqueViews: existing.uniqueViews + (increments.uniqueViews ?? 0),
      downloads: existing.downloads + (increments.downloads ?? 0),
      readMs: existing.readMs + (increments.readMs ?? 0),
      readCount: existing.readCount + (increments.readCount ?? 0),
    });
    return;
  }

  await ctx.db.insert("postStatsDaily", {
    postId,
    day,
    views: increments.views ?? 0,
    uniqueViews: increments.uniqueViews ?? 0,
    downloads: increments.downloads ?? 0,
    readMs: increments.readMs ?? 0,
    readCount: increments.readCount ?? 0,
  });
}

// Public: records an article view. Views by the article's own author are ignored.
export const recordView = mutation({
  args: { postId: v.id("blogs"), viewerId: v.string() },
  handler: async (ctx, args) => {
    if (!isValidViewerId(args.viewerId)) return null;
    const blog = await ctx.db.get(args.postId);
    if (!blog) return null;

    const identity = await ctx.auth.getUserIdentity();
    if (identity && blog.authorId === identity.subject) return null;

    const existingViewer = await ctx.db
      .query("postViewers")
      .withIndex("by_post_viewer", (q) =>
        q.eq("postId", args.postId).eq("viewerId", args.viewerId),
      )
      .first();

    if (!existingViewer) {
      await ctx.db.insert("postViewers", {
        postId: args.postId,
        viewerId: args.viewerId,
        firstSeenAt: Date.now(),
      });
    }

    await bumpDaily(ctx, args.postId, dayKey(), {
      views: 1,
      uniqueViews: existingViewer ? 0 : 1,
    });
    return null;
  },
});

// Public: records how long a reader spent on the article (minimum 5s).
export const recordRead = mutation({
  args: { postId: v.id("blogs"), durationMs: v.number() },
  handler: async (ctx, args) => {
    if (!Number.isFinite(args.durationMs) || args.durationMs < MIN_READ_MS) {
      return null;
    }

    const blog = await ctx.db.get(args.postId);
    if (!blog) return null;

    const identity = await ctx.auth.getUserIdentity();
    if (identity && blog.authorId === identity.subject) return null;

    const durationMs = Math.min(args.durationMs, MAX_READ_MS);
    await bumpDaily(ctx, args.postId, dayKey(), {
      readMs: Math.round(durationMs),
      readCount: 1,
    });
    return null;
  },
});

// Internal: called by the public `/download` HTTP route.
export const recordDownloadForPost = internalMutation({
  args: { postId: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.postId);
    if (!blog) return null;
    await bumpDaily(ctx, args.postId, dayKey(), { downloads: 1 });
    return null;
  },
});

type DailyRow = { day: string; views: number };

export const overview = query({
  args: { fromDay: v.string(), toDay: v.string() },
  handler: async (ctx, args) => {
    await requireAuthor(ctx);

    const days = eachDay(args.fromDay, args.toDay);
    if (days.length === 0) {
      return {
        totals: { views: 0, uniqueReaders: 0, downloads: 0, avgReadMs: 0, posts: 0 },
        topPost: null,
        daily: [] as DailyRow[],
        posts: [],
      };
    }

    const blogs = await ctx.db.query("blogs").order("desc").collect();

    const rows = await ctx.db
      .query("postStatsDaily")
      .withIndex("by_day", (q) =>
        q.gte("day", args.fromDay).lte("day", args.toDay),
      )
      .collect();

    const rangeStart = dayStartMs(args.fromDay);
    const rangeEnd = dayStartMs(args.toDay) + DAY_MS;
    const viewersInRange = await ctx.db
      .query("postViewers")
      .withIndex("by_first_seen", (q) =>
        q.gte("firstSeenAt", rangeStart).lte("firstSeenAt", rangeEnd),
      )
      .collect();

    const readersByPost = new Map<string, Set<string>>();
    const allReaders = new Set<string>();
    for (const viewer of viewersInRange) {
      allReaders.add(viewer.viewerId);
      const set = readersByPost.get(viewer.postId) ?? new Set<string>();
      set.add(viewer.viewerId);
      readersByPost.set(viewer.postId, set);
    }

    const perPost = new Map<
      string,
      { views: number; downloads: number; readMs: number; readCount: number }
    >();
    const dailyViews = new Map<string, number>(days.map((day) => [day, 0]));

    for (const row of rows) {
      const entry = perPost.get(row.postId) ?? {
        views: 0,
        downloads: 0,
        readMs: 0,
        readCount: 0,
      };
      entry.views += row.views;
      entry.downloads += row.downloads;
      entry.readMs += row.readMs;
      entry.readCount += row.readCount;
      perPost.set(row.postId, entry);
      dailyViews.set(row.day, (dailyViews.get(row.day) ?? 0) + row.views);
    }

    const posts = await Promise.all(
      blogs.map(async (blog) => {
        const entry = perPost.get(blog._id) ?? {
          views: 0,
          downloads: 0,
          readMs: 0,
          readCount: 0,
        };
        return {
          postId: blog._id,
          title: blog.title,
          createdAt: blog.createdAt,
          imageUrl: blog.imageId ? await ctx.storage.getUrl(blog.imageId) : null,
          views: entry.views,
          uniqueReaders: readersByPost.get(blog._id)?.size ?? 0,
          downloads: entry.downloads,
          avgReadMs: entry.readCount > 0 ? Math.round(entry.readMs / entry.readCount) : 0,
        };
      }),
    );

    const totals = { views: 0, downloads: 0, readMs: 0, readCount: 0 };
    for (const post of posts) {
      const entry = perPost.get(post.postId);
      totals.views += post.views;
      totals.downloads += post.downloads;
      if (entry) {
        totals.readMs += entry.readMs;
        totals.readCount += entry.readCount;
      }
    }

    const topPost = posts.reduce<null | { postId: Id<"blogs">; title: string; views: number }>(
      (best, post) => {
        if (post.views <= 0) return best;
        if (!best || post.views > best.views) {
          return { postId: post.postId, title: post.title, views: post.views };
        }
        return best;
      },
      null,
    );

    return {
      totals: {
        views: totals.views,
        uniqueReaders: allReaders.size,
        downloads: totals.downloads,
        avgReadMs: totals.readCount > 0 ? Math.round(totals.readMs / totals.readCount) : 0,
        posts: posts.length,
      },
      topPost,
      daily: days.map((day) => ({ day, views: dailyViews.get(day) ?? 0 })),
      posts,
    };
  },
});

export const postStats = query({
  args: {
    postId: v.id("blogs"),
    fromDay: v.string(),
    toDay: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuthor(ctx);

    const blog = await ctx.db.get(args.postId);
    if (!blog) return null;

    const days = eachDay(args.fromDay, args.toDay);
    if (days.length === 0) return null;

    const rows = await ctx.db
      .query("postStatsDaily")
      .withIndex("by_post_day", (q) =>
        q.eq("postId", args.postId).gte("day", args.fromDay).lte("day", args.toDay),
      )
      .collect();

    const viewers = await ctx.db
      .query("postViewers")
      .withIndex("by_post_viewer", (q) => q.eq("postId", args.postId))
      .collect();

    const rangeStart = dayStartMs(args.fromDay);
    const rangeEnd = dayStartMs(args.toDay) + DAY_MS;
    const uniqueReaders = new Set(
      viewers
        .filter((viewer) => viewer.firstSeenAt >= rangeStart && viewer.firstSeenAt < rangeEnd)
        .map((viewer) => viewer.viewerId),
    ).size;

    const dailyViews = new Map<string, number>(days.map((day) => [day, 0]));
    let views = 0;
    let downloads = 0;
    let readMs = 0;
    let readCount = 0;

    for (const row of rows) {
      views += row.views;
      downloads += row.downloads;
      readMs += row.readMs;
      readCount += row.readCount;
      dailyViews.set(row.day, (dailyViews.get(row.day) ?? 0) + row.views);
    }

    return {
      postId: blog._id,
      title: blog.title,
      createdAt: blog.createdAt,
      imageUrl: blog.imageId ? await ctx.storage.getUrl(blog.imageId) : null,
      views,
      uniqueReaders,
      downloads,
      avgReadMs: readCount > 0 ? Math.round(readMs / readCount) : 0,
      daily: days.map((day) => ({ day, views: dailyViews.get(day) ?? 0 })),
    };
  },
});
