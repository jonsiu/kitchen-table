# Technical Specification - Meal Prep App (Mobile-First)

## Architecture Overview

### Mobile-First System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web App       │    │   Admin Panel   │
│   (React Native)│    │   (Next.js)     │    │   (Next.js)     │
│   - Photo Capture│    │   - Meal Planning│    │   - Analytics   │
│   - Quick Add    │    │   - Recipe View  │    │   - User Mgmt   │
│   - Barcode Scan │    │   - Nutrition    │    │   - Content Mgmt│
│   - Inventory    │    │   - Preferences  │    │   - API Monitor │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │        Convex             │
                    │   (Database + Functions)  │
                    │   - Real-time Sync        │
                    │   - Image Storage         │
                    │   - User Data             │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │    External APIs          │
                    │  - Google Vision API      │
                    │  - Spoonacular API        │
                    │  - Edamam Nutrition API   │
                    │  - Claude API (fallback)  │
                    │  - Barcode Lookup APIs    │
                    └───────────────────────────┘
```

### Technology Stack

#### Mobile App (Primary Interface)
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation 6
- **Camera**: Expo Camera + Expo Image Picker
- **Barcode Scanning**: Expo Barcode Scanner
- **State Management**: Convex React hooks
- **Authentication**: Clerk React Native
- **UI Components**: React Native Elements + Custom components
- **Image Processing**: Expo Image Manipulator

#### Web App (Secondary Interface)
- **Framework**: Next.js 14+ (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Convex React hooks
- **Authentication**: Clerk
- **PWA Support**: Next.js PWA plugin

#### Backend
- **Database**: Convex (real-time database)
- **Functions**: Convex serverless functions
- **Authentication**: Clerk integration
- **File Storage**: Convex file storage
- **Image Processing**: Convex file storage + external APIs

#### External Services
- **Photo Recognition**: Google Vision API (primary), AWS Rekognition (fallback)
- **Recipe Data**: Spoonacular API (primary), Edamam Recipe API (secondary)
- **Nutrition Data**: Edamam Nutrition API, Spoonacular Nutrition
- **AI Recipe Generation**: Claude API (Anthropic) - fallback only
- **Barcode Lookup**: Open Food Facts API, UPC Database API
- **Analytics**: Convex Analytics, Custom event tracking

## Mobile-First Features

### Photo Recognition System

#### Multi-Photo Approach
1. **Fridge Photo**: Wide shot of entire fridge contents
2. **Pantry Photo**: Wide shot of pantry shelves  
3. **Spice Rack Photo**: Close-up of spice collection
4. **Individual Item Photos**: For specific items needing clarification

#### Photo Processing Pipeline
```
User Photo → Image Upload → Google Vision API → Ingredient Detection → User Confirmation → Database Storage
```

#### Photo Recognition API Integration
```typescript
interface PhotoRecognitionRequest {
  imageBase64: string;
  imageType: 'fridge' | 'pantry' | 'spice_rack' | 'individual_item';
  userId: string;
}

interface PhotoRecognitionResponse {
  detectedIngredients: {
    name: string;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    expiryDate?: string; // If detected from label
  }[];
  processingTime: number;
  apiUsed: 'google_vision' | 'aws_rekognition';
}
```

### Mobile App Core Features

#### 1. Quick Inventory Update
- **Photo Capture**: One-tap photo capture with auto-focus
- **Batch Processing**: Process multiple photos in background
- **Offline Support**: Queue photos when offline, sync when online
- **Smart Cropping**: Auto-crop to focus on food items

#### 2. Barcode Scanning
- **Real-time Scanning**: Instant barcode recognition
- **Product Lookup**: Automatic ingredient identification
- **Expiry Detection**: OCR for expiry date extraction
- **Fallback Manual Entry**: When barcode fails

#### 3. Smart Notifications
- **Expiry Alerts**: Push notifications 2-3 days before expiry
- **Recipe Suggestions**: Daily suggestions using expiring items
- **Shopping Reminders**: Based on meal plan and inventory

### User Experience Flow

#### Onboarding (2-3 minutes)
1. **Quick Survey**: 5-7 preference questions
2. **Photo Tutorial**: Interactive guide for taking good photos
3. **First Photo**: Guided fridge photo with real-time feedback
4. **Confirmation**: Review and edit detected ingredients

#### Daily Usage (30 seconds)
1. **Quick Photo**: Take photo of new groceries
2. **Auto-Detection**: Background processing of ingredients
3. **Quick Confirm**: Tap to confirm or edit items
4. **Done**: Items automatically added to inventory

#### Weekly Planning (2-3 minutes)
1. **View Expiring**: See items expiring soon
2. **Get Recipes**: App suggests recipes using expiring items
3. **Plan Week**: Select recipes for the week
4. **Shopping List**: Auto-generate list for missing ingredients

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

// Photo Recognition
interface PhotoRecognition {
  _id: Id<"photoRecognitions">;
  userId: string;
  imageUrl: string;
  imageType: "fridge" | "pantry" | "spice_rack" | "individual_item";
  detectedIngredients: {
    name: string;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    expiryDate?: number;
  }[];
  processingTime: number;
  apiUsed: "google_vision" | "aws_rekognition";
  isProcessed: boolean;
  createdAt: number;
}

// User Preferences
interface UserPreferences {
  _id: Id<"userPreferences">;
  userId: string;
  dietaryRestrictions: string[]; // ["vegetarian", "gluten-free", "dairy-free"]
  cuisinePreferences: string[]; // ["italian", "asian", "mexican"]
  cookingSkillLevel: "beginner" | "intermediate" | "advanced";
  timeConstraints: {
    quickMeals: boolean; // 15-30 minutes
    elaborateMeals: boolean; // 60+ minutes
  };
  familySize: number;
  healthGoals: {
    type: "weight_loss" | "muscle_gain" | "maintenance" | "health_condition";
    targetCalories?: number;
    macronutrientTargets?: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  mealPreferences: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: boolean;
  };
  allergies: string[];
  dislikedIngredients: string[];
  preferredCookingMethods: string[]; // ["baking", "grilling", "stir-frying"]
  createdAt: number;
  updatedAt: number;
}

// Recipe Ratings and Feedback
interface RecipeFeedback {
  _id: Id<"recipeFeedback">;
  userId: string;
  recipeId: Id<"recipes">;
  rating: number; // 1-5 stars
  difficulty: "too_easy" | "just_right" | "too_hard";
  taste: "loved" | "liked" | "neutral" | "disliked";
  wouldMakeAgain: boolean;
  comments?: string;
  modifications?: string;
  createdAt: number;
}

// Usage Analytics
interface UsageAnalytics {
  _id: Id<"usageAnalytics">;
  userId: string;
  eventType: "photo_taken" | "recipe_viewed" | "recipe_cooked" | "inventory_updated";
  eventData: {
    photoType?: string;
    recipeId?: Id<"recipes">;
    ingredientCount?: number;
    timeSpent?: number;
  };
  timestamp: number;
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

#### Photo Recognition
```typescript
// Process photo for ingredient recognition
export const processPhoto = mutation({
  args: {
    userId: v.string(),
    imageBase64: v.string(),
    imageType: v.union(v.literal("fridge"), v.literal("pantry"), v.literal("spice_rack"), v.literal("individual_item")),
  },
  handler: async (ctx, args) => {
    // Upload image to Convex storage
    // Call Google Vision API
    // Store recognition results
    // Return detected ingredients
  },
});

// Get photo recognition results
export const getPhotoRecognition = query({
  args: {
    userId: v.string(),
    photoId: v.id("photoRecognitions"),
  },
  handler: async (ctx, args) => {
    // Return photo recognition results
  },
});

// Confirm detected ingredients
export const confirmDetectedIngredients = mutation({
  args: {
    photoId: v.id("photoRecognitions"),
    confirmedIngredients: v.array(v.object({
      name: v.string(),
      quantity: v.number(),
      unit: v.string(),
      location: v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer")),
      expiryDate: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    // Add confirmed ingredients to user inventory
    // Mark photo as processed
  },
});
```

#### User Preferences
```typescript
// Save user preferences
export const saveUserPreferences = mutation({
  args: {
    userId: v.string(),
    preferences: v.object({
      dietaryRestrictions: v.array(v.string()),
      cuisinePreferences: v.array(v.string()),
      cookingSkillLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
      timeConstraints: v.object({
        quickMeals: v.boolean(),
        elaborateMeals: v.boolean(),
      }),
      familySize: v.number(),
      healthGoals: v.object({
        type: v.union(v.literal("weight_loss"), v.literal("muscle_gain"), v.literal("maintenance"), v.literal("health_condition")),
        targetCalories: v.optional(v.number()),
        macronutrientTargets: v.optional(v.object({
          protein: v.number(),
          carbs: v.number(),
          fat: v.number(),
        })),
      }),
      mealPreferences: v.object({
        breakfast: v.boolean(),
        lunch: v.boolean(),
        dinner: v.boolean(),
        snacks: v.boolean(),
      }),
      allergies: v.array(v.string()),
      dislikedIngredients: v.array(v.string()),
      preferredCookingMethods: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Save or update user preferences
  },
});

// Get user preferences
export const getUserPreferences = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Return user preferences
  },
});
```

#### Recipe Feedback
```typescript
// Submit recipe feedback
export const submitRecipeFeedback = mutation({
  args: {
    userId: v.string(),
    recipeId: v.id("recipes"),
    rating: v.number(),
    difficulty: v.union(v.literal("too_easy"), v.literal("just_right"), v.literal("too_hard")),
    taste: v.union(v.literal("loved"), v.literal("liked"), v.literal("neutral"), v.literal("disliked")),
    wouldMakeAgain: v.boolean(),
    comments: v.optional(v.string()),
    modifications: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Save recipe feedback
    // Update recipe popularity score
  },
});

// Get personalized recipe recommendations
export const getPersonalizedRecipes = query({
  args: {
    userId: v.string(),
    availableIngredients: v.array(v.id("ingredients")),
    mealType: v.optional(v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner"))),
    maxPrepTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get user preferences
    // Find recipes matching preferences and available ingredients
    // Prioritize recipes using expiring ingredients
    // Return personalized recommendations
  },
});
```

## External API Integration

### Google Vision API Integration
```typescript
interface VisionAPIRequest {
  requests: {
    image: {
      content: string; // base64 encoded image
    };
    features: {
      type: "LABEL_DETECTION" | "TEXT_DETECTION" | "OBJECT_LOCALIZATION";
      maxResults: number;
    }[];
  }[];
}

interface VisionAPIResponse {
  responses: {
    labelAnnotations?: {
      description: string;
      score: number;
      topicality: number;
    }[];
    textAnnotations?: {
      description: string;
      boundingPoly: {
        vertices: { x: number; y: number }[];
      };
    }[];
    localizedObjectAnnotations?: {
      name: string;
      score: number;
      boundingPoly: {
        normalizedVertices: { x: number; y: number }[];
      };
    }[];
  }[];
}
```

### Spoonacular API Integration
```typescript
interface SpoonacularRecipeRequest {
  ingredients: string; // comma-separated list
  number?: number; // max 100
  limitLicense?: boolean;
  ranking?: number; // 1 or 2
  ignorePantry?: boolean;
}

interface SpoonacularRecipeResponse {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: {
    id: number;
    amount: number;
    unit: string;
    unitLong: string;
    unitShort: string;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    meta: string[];
    extendedName: string;
    image: string;
  }[];
  usedIngredients: {
    id: number;
    amount: number;
    unit: string;
    unitLong: string;
    unitShort: string;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    meta: string[];
    extendedName: string;
    image: string;
  }[];
  unusedIngredients: any[];
  likes: number;
}

interface SpoonacularRecipeDetails {
  id: number;
  title: string;
  image: string;
  imageType: string;
  servings: number;
  readyInMinutes: number;
  license: string;
  sourceName: string;
  sourceUrl: string;
  spoonacularSourceUrl: string;
  aggregateLikes: number;
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  analyzedInstructions: any[];
  cheap: boolean;
  creditsText: string;
  cuisines: string[];
  dairyFree: boolean;
  diets: string[];
  gaps: string;
  glutenFree: boolean;
  instructions: string;
  ketogenic: boolean;
  lowFodmap: boolean;
  occasions: string[];
  sustainable: boolean;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  whole30: boolean;
  weightWatcherSmartPoints: number;
  dishTypes: string[];
  extendedIngredients: {
    id: number;
    aisle: string;
    image: string;
    consistency: string;
    name: string;
    nameClean: string;
    original: string;
    originalName: string;
    amount: number;
    unit: string;
    meta: string[];
    measures: {
      us: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
      metric: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
    };
  }[];
  summary: string;
  winePairing: any;
}
```

### Edamam Recipe API Integration
```typescript
interface EdamamRecipeRequest {
  q: string; // search query
  app_id: string;
  app_key: string;
  from?: number; // start index
  to?: number; // end index
  diet?: string[]; // ["low-carb", "low-fat", "high-protein"]
  health?: string[]; // ["vegetarian", "vegan", "gluten-free"]
  cuisineType?: string[]; // ["italian", "asian", "mexican"]
  mealType?: string[]; // ["breakfast", "lunch", "dinner", "snack"]
  dishType?: string[]; // ["starter", "main course", "dessert"]
}

interface EdamamRecipeResponse {
  q: string;
  from: number;
  to: number;
  more: boolean;
  count: number;
  hits: {
    recipe: {
      uri: string;
      label: string;
      image: string;
      images: {
        THUMBNAIL: {
          url: string;
          width: number;
          height: number;
        };
        SMALL: {
          url: string;
          width: number;
          height: number;
        };
        REGULAR: {
          url: string;
          width: number;
          height: number;
        };
        LARGE: {
          url: string;
          width: number;
          height: number;
        };
      };
      source: string;
      url: string;
      shareAs: string;
      yield: number;
      dietLabels: string[];
      healthLabels: string[];
      cautions: string[];
      ingredientLines: string[];
      ingredients: {
        text: string;
        quantity: number;
        measure: string;
        food: string;
        weight: number;
        foodCategory: string;
        foodId: string;
        image: string;
      }[];
      calories: number;
      glycemicIndex: number;
      inflammatoryIndex: number;
      totalCO2Emissions: number;
      co2EmissionsClass: string;
      totalWeight: number;
      totalTime: number;
      cuisineType: string[];
      mealType: string[];
      dishType: string[];
      totalNutrients: {
        [key: string]: {
          label: string;
          quantity: number;
          unit: string;
        };
      };
      totalDaily: {
        [key: string]: {
          label: string;
          quantity: number;
          unit: string;
        };
      };
      digest: {
        label: string;
        tag: string;
        schemaOrgTag: string;
        total: number;
        hasRDI: boolean;
        daily: number;
        unit: string;
        sub: {
          label: string;
          tag: string;
          schemaOrgTag: string;
          total: number;
          hasRDI: boolean;
          daily: number;
          unit: string;
        }[];
      }[];
    };
    _links: {
      self: {
        href: string;
        title: string;
      };
      next: {
        href: string;
        title: string;
      };
    };
  }[];
  _links: {
    next: {
      href: string;
      title: string;
    };
  };
}
```

### Claude API Integration (Fallback)
```typescript
interface ClaudeRecipeRequest {
  availableIngredients: string[];
  mealType: string;
  dietaryRestrictions?: string[];
  maxPrepTime?: number;
  servings?: number;
  cuisinePreferences?: string[];
  cookingSkillLevel?: string;
}

interface ClaudeRecipeResponse {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
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
  tags: string[];
  equipment: string[];
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
  totalDaily: {
    [key: string]: {
      label: string;
      quantity: number;
      unit: string;
    };
  };
  healthLabels: string[];
  dietLabels: string[];
  cautions: string[];
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
- React Native development with Expo
- Local image processing testing

### Production Environment
- **Mobile App**: Expo Application Services (EAS) for React Native builds
- **Web App**: Vercel deployment for Next.js
- **Database**: Convex production database
- **Authentication**: Clerk production authentication
- **File Storage**: Convex file storage for images
- **External APIs**: Production API keys with rate limiting

### Mobile App Distribution
- **iOS**: App Store distribution via EAS
- **Android**: Google Play Store distribution via EAS
- **Beta Testing**: TestFlight (iOS) and Google Play Console (Android)
- **Over-the-Air Updates**: Expo Updates for JavaScript changes

### API Cost Management
- **Rate Limiting**: Implement per-user API call limits
- **Caching**: Cache recipe results for common ingredient combinations
- **Fallback Strategy**: Use free APIs first, AI only when necessary
- **Usage Monitoring**: Track API costs per user and implement limits

### Monitoring & Analytics
- **Database**: Convex dashboard for database monitoring
- **Web Performance**: Vercel analytics for web performance
- **Mobile Analytics**: Expo Analytics for mobile app usage
- **Custom Analytics**: User engagement and feature usage tracking
- **Error Tracking**: Sentry for error monitoring across platforms
- **API Monitoring**: Track external API usage and costs

### Security Considerations
- **Image Privacy**: Images processed and deleted after recognition
- **API Keys**: Secure storage of external API credentials
- **User Data**: GDPR compliance for user data handling
- **Mobile Security**: Secure storage of sensitive data on device
- **Network Security**: HTTPS for all API communications
