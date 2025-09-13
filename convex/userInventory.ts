import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Create user mutation (separate from queries)
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Helper function to get user (queries are read-only)
async function getUser(ctx: any, clerkId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", clerkId))
    .first();

  return user;
}

// Get user's inventory with expiry tracking
export const getUserInventory = query({
  args: { 
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.clerkId);
    
    if (!user) {
      // Return empty array if user doesn't exist yet
      return [];
    }

    const inventory = await ctx.db
      .query("userInventory")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    // Get ingredient details for each inventory item
    const inventoryWithDetails = await Promise.all(
      inventory.map(async (item) => {
        const ingredient = await ctx.db.get(item.ingredientId);
        return {
          ...item,
          ingredient,
        };
      })
    );

    // Sort by expiry date (expiring soon first)
    return inventoryWithDetails.sort((a, b) => {
      if (!a.expiryDate && !b.expiryDate) return 0;
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return a.expiryDate - b.expiryDate;
    });
  },
});

// Get inventory by location
export const getInventoryByLocation = query({
  args: { 
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    location: v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer"))
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.clerkId);
    
    if (!user) {
      // Return empty array if user doesn't exist yet
      return [];
    }

    const inventory = await ctx.db
      .query("userInventory")
      .withIndex("by_user_location", (q: any) => 
        q.eq("userId", user._id).eq("location", args.location)
      )
      .collect();

    // Get ingredient details for each inventory item
    const inventoryWithDetails = await Promise.all(
      inventory.map(async (item) => {
        const ingredient = await ctx.db.get(item.ingredientId);
        return {
          ...item,
          ingredient,
        };
      })
    );

    return inventoryWithDetails.sort((a, b) => {
      if (!a.expiryDate && !b.expiryDate) return 0;
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return a.expiryDate - b.expiryDate;
    });
  },
});

// Get expiring items (within next 3 days)
export const getExpiringItems = query({
  args: { 
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.clerkId);
    
    if (!user) {
      // Return empty array if user doesn't exist yet
      return [];
    }

    const threeDaysFromNow = Date.now() + (3 * 24 * 60 * 60 * 1000);
    
    const inventory = await ctx.db
      .query("userInventory")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => 
        q.and(
          q.neq(q.field("expiryDate"), undefined),
          q.lte(q.field("expiryDate"), threeDaysFromNow)
        )
      )
      .collect();

    // Get ingredient details for each inventory item
    const inventoryWithDetails = await Promise.all(
      inventory.map(async (item) => {
        const ingredient = await ctx.db.get(item.ingredientId);
        return {
          ...item,
          ingredient,
        };
      })
    );

    return inventoryWithDetails.sort((a, b) => a.expiryDate! - b.expiryDate!);
  },
});

// Add item to inventory
export const addToInventory = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    ingredientId: v.id("ingredients"),
    quantity: v.number(),
    unit: v.string(),
    location: v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer")),
    expiryDate: v.optional(v.number()),
    purchaseDate: v.optional(v.number()),
    isFrozen: v.boolean(),
    thawDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // First ensure user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", args.clerkId))
      .first();

    let user;
    if (existingUser) {
      user = existingUser;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    if (!user) {
      throw new Error("Failed to create or find user");
    }

    // Check if ingredient already exists in inventory
    const existingItem = await ctx.db
      .query("userInventory")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => 
        q.and(
          q.eq(q.field("ingredientId"), args.ingredientId),
          q.eq(q.field("location"), args.location)
        )
      )
      .first();

    if (existingItem) {
      // Update existing item quantity
      return await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
        updatedAt: Date.now(),
      });
    }

    // Create new inventory item
    return await ctx.db.insert("userInventory", {
      userId: user._id,
      ingredientId: args.ingredientId,
      quantity: args.quantity,
      unit: args.unit,
      location: args.location,
      expiryDate: args.expiryDate,
      purchaseDate: args.purchaseDate || Date.now(),
      isFrozen: args.isFrozen,
      thawDate: args.thawDate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update inventory item
export const updateInventoryItem = mutation({
  args: {
    inventoryId: v.id("userInventory"),
    updates: v.object({
      quantity: v.optional(v.number()),
      unit: v.optional(v.string()),
      location: v.optional(v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer"))),
      expiryDate: v.optional(v.number()),
      isFrozen: v.optional(v.boolean()),
      thawDate: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.inventoryId, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete inventory item
export const deleteInventoryItem = mutation({
  args: { inventoryId: v.id("userInventory") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.inventoryId);
  },
});

// Get inventory statistics
export const getInventoryStats = query({
  args: { 
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.clerkId);
    
    if (!user) {
      // Return empty stats if user doesn't exist yet
      return {
        totalItems: 0,
        expiringSoon: 0,
        expiringThisWeek: 0,
        byLocation: {
          fridge: 0,
          pantry: 0,
          freezer: 0,
        },
      };
    }

    const inventory = await ctx.db
      .query("userInventory")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    const now = Date.now();
    const threeDaysFromNow = now + (3 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = now + (7 * 24 * 60 * 60 * 1000);

    const stats = {
      totalItems: inventory.length,
      expiringSoon: inventory.filter(item => 
        item.expiryDate && item.expiryDate <= threeDaysFromNow
      ).length,
      expiringThisWeek: inventory.filter(item => 
        item.expiryDate && item.expiryDate <= sevenDaysFromNow
      ).length,
      byLocation: {
        fridge: inventory.filter(item => item.location === "fridge").length,
        pantry: inventory.filter(item => item.location === "pantry").length,
        freezer: inventory.filter(item => item.location === "freezer").length,
      },
    };

    return stats;
  },
});
