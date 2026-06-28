import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyToken } from "./auth";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
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
    token: v.string(),
    title: v.string(),
    content: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Verify user token
    const payload = await verifyToken(args.token);
    
    const blogId = await ctx.db.insert("blogs", {
      title: args.title,
      content: args.content,
      imageId: args.imageId,
      authorId: payload.userId as Id<"users">,
      createdAt: Date.now(),
    });
    
    return blogId;
  },
});

export const edit = mutation({
  args: {
    token: v.string(),
    blogId: v.id("blogs"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify user token
    const payload = await verifyToken(args.token);
    
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    
    // Ensure only the author can edit their own blog
    if (blog.authorId !== payload.userId) {
      throw new Error("Not authorized to edit this blog");
    }
    
    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    
    await ctx.db.patch(args.blogId, updates);
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    // Verify user token
    const payload = await verifyToken(args.token);
    
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    
    // Ensure only the author can delete their own blog
    if (blog.authorId !== payload.userId) {
      throw new Error("Not authorized to delete this blog");
    }

    // Optional: Delete the associated image from storage
    if (blog.imageId) {
      await ctx.storage.delete(blog.imageId);
    }
    
    await ctx.db.delete(args.blogId);
  },
});
