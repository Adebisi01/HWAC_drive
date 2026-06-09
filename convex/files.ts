import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getFiles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("files").collect();
  },
});
export const getFile = query({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
export const addFile = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    owner: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const newFile = await ctx.db.insert("files", args);
    return newFile;
  },
});
