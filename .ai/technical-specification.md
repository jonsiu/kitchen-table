# Technical Specification - Meal Prep App

## Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web App       │    │   Admin Panel   │
│   (React Native)│    │   (Next.js)     │    │   (Next.js)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │        Convex             │
                    │   (Database + Functions)  │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │    External APIs          │
                    │  - Claude API             │
                    │  - Nutrition APIs         │
                    │  - Recipe APIs            │
                    │  - Photo Recognition      │
                    └───────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Convex React hooks
- **Authentication**: Clerk
- **Mobile**: React Native (for photo recognition)

#### Backend
- **Database**: Convex (real-time database)
- **Functions**: Convex serverless functions
- **Authentication**: Clerk integration
- **File Storage**: Convex file storage

#### External Services
- **AI Recipe Generation**: Claude API (Anthropic)
- **Nutrition Data**: Edamam Nutrition API, Spoonacular
- **Recipe Data**: Spoonacular Recipe API
- **Photo Recognition**: Google Vision API or AWS Rekognition
- **Barcode Lookup**: Open Food Facts API

## Database Schema

### Core Tables

```typescript
// Users and Authentication (handled by Clerk)
interface User {
  id: string; // Clerk user ID
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

// Ingredients and Nutrition
interface Ingredient {
  _id: Id<"ingredients">;
  name: string;
  category: string;
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    // ... other nutrients
  };
  commonUnits: string[];
  barcode?: string;
  imageUrl?: string;
  createdAt: number;
}

// User Inventory
interface UserInventory {
  _id: Id<"userInventory">;
  userId: string;
  ingredientId: Id<"ingredients">;
  quantity: number;
  unit: string;
  location: "fridge" | "pantry" | "freezer";
  expiryDate?: number;
  purchaseDate: number;
  isFrozen: boolean;
  thawDate?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// Recipes
interface Recipe {
  _id: Id<"recipes">;
  title: string;
  description?: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine?: string;
  tags: string[];
  imageUrl?: string;
  source?: string; // "ai_generated" | "spoonacular" | "user_created"
  aiPrompt?: string; // For AI-generated recipes
  createdAt: number;
  updatedAt: number;
}

// Recipe Ingredients
interface RecipeIngredient {
  _id: Id<"recipeIngredients">;
  recipeId: Id<"recipes">;
  ingredientId: Id<"ingredients">;
  quantity: number;
  unit: string;
  preparation?: string; // "chopped", "diced", etc.
  isOptional: boolean;
  order: number;
}

// Recipe Directions
interface RecipeDirection {
  _id: Id<"recipeDirections">;
  recipeId: Id<"recipes">;
  stepNumber: number;
  description: string;
  duration?: number; // minutes
  temperature?: number; // for cooking instructions
}

// User Health Goals
interface UserHealthGoals {
  _id: Id<"userHealthGoals">;
  userId: string;
  goalType: "weight_loss" | "muscle_gain" | "maintenance" | "pregnancy" | "health_condition";
  targetWeight?: number;
  currentWeight?: number;
  height?: number;
  age?: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  targetCalories: number;
  macronutrientTargets: {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
  };
  dietaryRestrictions: string[];
  healthConditions: string[];
  allergies: string[];
  createdAt: number;
  updatedAt: number;
}

// Meal Plans
interface MealPlan {
  _id: Id<"mealPlans">;
  userId: string;
  weekStartDate: number;
  meals: {
    date: number;
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    recipeId: Id<"recipes">;
    servings: number;
    isCompleted: boolean;
  }[];
  createdAt: number;
  updatedAt: number;
}

// Ingredient Substitutions
interface IngredientSubstitution {
  _id: Id<"ingredientSubstitutions">;
  originalIngredientId: Id<"ingredients">;
  substituteIngredientId: Id<"ingredients">;
  substitutionRatio: number; // 1 cup original = X cups substitute
  notes?: string;
  isVerified: boolean;
  createdAt: number;
}

// Family Profiles
interface FamilyProfile {
  _id: Id<"familyProfiles">;
  familyName: string;
  members: string[]; // User IDs
  sharedInventory: boolean;
  mealPreferences: {
    cuisinePreferences: string[];
    dietaryRestrictions: string[];
    mealTimes: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
  };
  createdAt: number;
  updatedAt: number;
}

// Shopping Lists
interface ShoppingList {
  _id: Id<"shoppingLists">;
  userId: string;
  name: string;
  items: {
    ingredientId: Id<"ingredients">;
    quantity: number;
    unit: string;
    isPurchased: boolean;
    estimatedCost?: number;
  }[];
  createdAt: number;
  updatedAt: number;
}
```

## API Design

### Convex Functions

#### Inventory Management
```typescript
// Add ingredient to inventory
export const addToInventory = mutation({
  args: {
    ingredientId: v.id("ingredients"),
    quantity: v.number(),
    unit: v.string(),
    location: v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer")),
    expiryDate: v.optional(v.number()),
    purchaseDate: v.number(),
    isFrozen: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});

// Get user inventory with expiry alerts
export const getUserInventory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Implementation with expiry prioritization
  },
});

// Update inventory item
export const updateInventoryItem = mutation({
  args: {
    inventoryId: v.id("userInventory"),
    updates: v.object({
      quantity: v.optional(v.number()),
      expiryDate: v.optional(v.number()),
      location: v.optional(v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer"))),
    }),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

#### Recipe Generation
```typescript
// Generate AI recipe from available ingredients
export const generateAIRecipe = mutation({
  args: {
    userId: v.string(),
    availableIngredients: v.array(v.id("ingredients")),
    mealType: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner")),
    dietaryRestrictions: v.optional(v.array(v.string())),
    maxPrepTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Call Claude API with available ingredients
    // Create recipe in database
    // Return recipe ID
  },
});

// Get recipes for available ingredients
export const getRecipesForIngredients = query({
  args: {
    ingredientIds: v.array(v.id("ingredients")),
    mealType: v.optional(v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner"))),
    maxPrepTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find recipes that can be made with available ingredients
    // Prioritize recipes using expiring ingredients
  },
});
```

#### Meal Planning
```typescript
// Generate weekly meal plan
export const generateMealPlan = mutation({
  args: {
    userId: v.string(),
    weekStartDate: v.number(),
    preferences: v.optional(v.object({
      mealTypes: v.array(v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner"))),
      maxPrepTime: v.optional(v.number()),
      cuisinePreferences: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, args) => {
    // Generate meal plan based on inventory and preferences
    // Prioritize expiring ingredients
  },
});

// Get meal plan for week
export const getMealPlan = query({
  args: {
    userId: v.string(),
    weekStartDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Return meal plan for specified week
  },
});
```

## External API Integration

### Claude API Integration
```typescript
interface ClaudeRecipeRequest {
  availableIngredients: string[];
  mealType: string;
  dietaryRestrictions?: string[];
  maxPrepTime?: number;
  servings?: number;
}

interface ClaudeRecipeResponse {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    preparation?: string;
  }[];
  directions: {
    step: number;
    description: string;
    duration?: number;
  }[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
```

### Nutrition API Integration
```typescript
// Edamam Nutrition API
interface NutritionRequest {
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

interface NutritionResponse {
  calories: number;
  totalNutrients: {
    [key: string]: {
      label: string;
      quantity: number;
      unit: string;
    };
  };
}
```

## Security & Performance

### Authentication & Authorization
- Clerk handles user authentication
- Convex functions validate user permissions
- Row-level security for user data

### Performance Optimizations
- Convex real-time subscriptions for inventory updates
- Caching for nutrition data
- Image optimization for recipe photos
- Lazy loading for large ingredient lists

### Data Privacy
- User data encrypted at rest
- GDPR compliance for EU users
- Data retention policies
- User data export/deletion capabilities

## Deployment Strategy

### Development Environment
- Local Convex development
- Clerk development keys
- Mock external APIs for testing

### Production Environment
- Vercel deployment for web app
- Convex production database
- Clerk production authentication
- External API rate limiting and error handling

### Monitoring & Analytics
- Convex dashboard for database monitoring
- Vercel analytics for web performance
- Custom analytics for user engagement
- Error tracking with Sentry
