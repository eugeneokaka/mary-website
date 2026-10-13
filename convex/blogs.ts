import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthor } from "./auth";
import { Id } from "./_generated/dataModel";

// Authenticated: only authorized authors can request an upload URL.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthor(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

// Public: resolve a storage id to a readable URL (used to render uploaded images).
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    // Return all blogs, ordered by newest first
    const blogs = await ctx.db.query("blogs").order("desc").collect();

    // Convert storage IDs to accessible URLs
    return Promise.all(
      blogs.map(async (blog) => ({
        ...blog,
        imageUrl: blog.imageId ? await ctx.storage.getUrl(blog.imageId) : null,
      }))
    );
  },
});

// Authenticated: returns only the blogs authored by the signed-in user.
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuthor(ctx);

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_author", (q) => q.eq("authorId", identity.subject))
      .order("desc")
      .collect();

    return Promise.all(
      blogs.map(async (blog) => ({
        ...blog,
        imageUrl: blog.imageId ? await ctx.storage.getUrl(blog.imageId) : null,
      }))
    );
  },
});

export const getById = query({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
    if (!blog) return null;

    return {
      ...blog,
      imageUrl: blog.imageId ? await ctx.storage.getUrl(blog.imageId) : null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuthor(ctx);

    const blogId = await ctx.db.insert("blogs", {
      title: args.title,
      content: args.content,
      imageId: args.imageId,
      authorId: identity.subject,
      createdAt: Date.now(),
    });

    return blogId;
  },
});

export const edit = mutation({
  args: {
    blogId: v.id("blogs"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuthor(ctx);

    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Ensure only the author can edit their own blog
    if (blog.authorId !== identity.subject) {
      throw new Error("Not authorized to edit this blog");
    }

    const updates: { title?: string; content?: string; imageId?: Id<"_storage"> | undefined } = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;

    // Only touch imageId if a new one was provided (allows replacing the cover image)
    if (args.imageId !== undefined) {
      updates.imageId = args.imageId;
      // Delete the old image from storage to avoid orphans
      if (blog.imageId && blog.imageId !== args.imageId) {
        await ctx.storage.delete(blog.imageId);
      }
    }

    await ctx.db.patch(args.blogId, updates);
  },
});

export const remove = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuthor(ctx);

    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Ensure only the author can delete their own blog
    if (blog.authorId !== identity.subject) {
      throw new Error("Not authorized to delete this blog");
    }

    // Delete the associated image from storage
    if (blog.imageId) {
      await ctx.storage.delete(blog.imageId);
    }

    await ctx.db.delete(args.blogId);
  },
});
