import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all ingredients
export const getAllIngredients = query({
  handler: async (ctx) => {
    return await ctx.db.query("ingredients").collect();
  },
});

// Get ingredients by category
export const getIngredientsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Search ingredients by name
export const searchIngredients = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allIngredients = await ctx.db.query("ingredients").collect();
    return allIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});

// Create new ingredient
export const createIngredient = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    unit: v.string(),
    nutritionPerUnit: v.optional(v.object({
      calories: v.optional(v.number()),
      protein: v.optional(v.number()),
      carbs: v.optional(v.number()),
      fat: v.optional(v.number()),
      fiber: v.optional(v.number()),
    })),
    barcode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ingredients", {
      name: args.name,
      category: args.category,
      unit: args.unit,
      nutritionPerUnit: args.nutritionPerUnit,
      barcode: args.barcode,
      createdAt: Date.now(),
    });
  },
});

// Get ingredient by barcode
export const getIngredientByBarcode = query({
  args: { barcode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .withIndex("by_barcode", (q) => q.eq("barcode", args.barcode))
      .first();
  },
});
