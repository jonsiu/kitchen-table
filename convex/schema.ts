import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles and authentication
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Ingredients database
  ingredients: defineTable({
    name: v.string(),
    category: v.string(), // e.g., "vegetables", "meat", "dairy", "pantry"
    unit: v.string(), // e.g., "kg", "g", "ml", "piece"
    nutritionPerUnit: v.optional(v.object({
      calories: v.optional(v.number()),
      protein: v.optional(v.number()),
      carbs: v.optional(v.number()),
      fat: v.optional(v.number()),
      fiber: v.optional(v.number()),
    })),
    barcode: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_category", ["category"])
    .index("by_barcode", ["barcode"]),

  // User inventory
  userInventory: defineTable({
    userId: v.id("users"),
    ingredientId: v.id("ingredients"),
    quantity: v.number(),
    unit: v.string(),
    location: v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer")),
    expiryDate: v.optional(v.number()), // timestamp
    purchaseDate: v.optional(v.number()), // timestamp
    isFrozen: v.boolean(),
    thawDate: v.optional(v.number()), // timestamp for freezer items
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_location", ["userId", "location"])
    .index("by_user_expiry", ["userId", "expiryDate"])
    .index("by_ingredient", ["ingredientId"]),

  // Recipes
  recipes: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    instructions: v.array(v.string()),
    prepTime: v.optional(v.number()), // minutes
    cookTime: v.optional(v.number()), // minutes
    servings: v.number(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    category: v.string(), // e.g., "breakfast", "lunch", "dinner", "snack"
    tags: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    source: v.optional(v.string()), // "ai", "spoonacular", "edamam", "manual"
    nutritionPerServing: v.optional(v.object({
      calories: v.optional(v.number()),
      protein: v.optional(v.number()),
      carbs: v.optional(v.number()),
      fat: v.optional(v.number()),
      fiber: v.optional(v.number()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"])
    .index("by_source", ["source"]),

  // Recipe ingredients
  recipeIngredients: defineTable({
    recipeId: v.id("recipes"),
    ingredientId: v.id("ingredients"),
    quantity: v.number(),
    unit: v.string(),
    isOptional: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index("by_recipe", ["recipeId"])
    .index("by_ingredient", ["ingredientId"]),

  // User health goals
  userHealthGoals: defineTable({
    userId: v.id("users"),
    goalType: v.union(
      v.literal("weight_loss"),
      v.literal("muscle_gain"),
      v.literal("maintenance"),
      v.literal("pregnancy"),
      v.literal("health_condition")
    ),
    targetCalories: v.optional(v.number()),
    macronutrientTargets: v.optional(v.object({
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
    })),
    dietaryRestrictions: v.array(v.string()),
    healthConditions: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Meal plans
  mealPlans: defineTable({
    userId: v.id("users"),
    weekStartDate: v.number(), // timestamp
    meals: v.array(v.object({
      date: v.number(), // timestamp
      mealType: v.union(
        v.literal("breakfast"),
        v.literal("lunch"),
        v.literal("dinner"),
        v.literal("snack")
      ),
      recipeId: v.id("recipes"),
      servings: v.number(),
      isCompleted: v.boolean(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_week", ["userId", "weekStartDate"]),

  // Shopping lists
  shoppingLists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    items: v.array(v.object({
      ingredientId: v.id("ingredients"),
      quantity: v.number(),
      unit: v.string(),
      isPurchased: v.boolean(),
      notes: v.optional(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
