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
});
