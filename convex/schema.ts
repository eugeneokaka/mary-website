import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  blogs: defineTable({
    title: v.string(),
    content: v.string(),
    imageId: v.optional(v.id("_storage")), // Optional reference to an uploaded image
    authorId: v.string(), // Better Auth user id of the author
    createdAt: v.number(),
  }).index("by_author", ["authorId"]),

  // Daily rollups so any date range is a cheap indexed scan.
  postStatsDaily: defineTable({
    postId: v.id("blogs"),
    day: v.string(), // YYYY-MM-DD (UTC)
    views: v.number(),
    uniqueViews: v.number(),
    downloads: v.number(),
    readMs: v.number(),
    readCount: v.number(),
  })
    .index("by_post_day", ["postId", "day"])
    .index("by_day", ["day"]),

  // One row per anonymous reader per post, used for unique counts.
  postViewers: defineTable({
    postId: v.id("blogs"),
    viewerId: v.string(),
    firstSeenAt: v.number(),
  })
    .index("by_post_viewer", ["postId", "viewerId"])
    .index("by_first_seen", ["firstSeenAt"]),
});
