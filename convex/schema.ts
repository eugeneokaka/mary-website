import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    password: v.string(), // We'll store the hashed password here, not plaintext!
  }).index("by_username", ["username"]), // Index to quickly look up users by their username for login

  blogs: defineTable({
    title: v.string(),
    content: v.string(),
    imageId: v.optional(v.id("_storage")), // Optional reference to an uploaded image
    authorId: v.id("users"),
    createdAt: v.number(),
  }).index("by_author", ["authorId"]),
});
