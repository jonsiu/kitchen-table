# Meal Prep App - Detailed Requirements

## Project Overview
A smart meal planning application that generates recipes based on available ingredients, prioritizes expiring items, and supports personalized nutrition goals for individuals and families.

## Core Features

### 1. Inventory Management
**Primary Input Methods:**
- **Photo Recognition** (Primary) - Mobile app component for easy ingredient scanning
- **Barcode Scanning** (Secondary) - For packaged products
- **Manual Entry** (Fallback) - For items without barcodes or when scanning fails

**Inventory Tracking:**
- Track ingredients in fridge, pantry, and freezer
- Expiry date tracking with visual indicators
- Freshness monitoring for produce
- Freezer thaw reminders (1-2 days before cooking)
- Quantity tracking (how much of each ingredient)

**Expiry Priority System:**
- **Critical** (1-2 days): Red alerts, highest recipe priority
- **Warning** (3-5 days): Yellow alerts, high recipe priority  
- **Normal** (6+ days): Green status, standard priority
- **Frozen** (weeks/months): Blue status, thaw reminders

### 2. Smart Recipe Generation
**AI-Powered Recipe Creation:**
- Generate recipes based on available ingredients
- Prioritize recipes using ingredients expiring soonest
- Leverage Claude API for intelligent recipe generation
- Integration with existing recipe APIs for variety and validation

**Recipe Intelligence:**
- Nutritional analysis per recipe
- Cooking time estimation
- Difficulty level assessment
- Equipment requirements
- Serving size calculations

### 3. Ingredient Substitutions
**Smart Substitution Engine:**
- Suggest alternatives for missing ingredients
- Nutritional equivalence matching
- Cost-aware alternatives
- Dietary restriction considerations (allergies, preferences)
- Availability at local stores

### 4. Personalized Nutrition & Health Goals
**Individual Profiles:**
- Start with single user, expand to family (2+ members)
- Individual dietary requirements and restrictions
- Health condition considerations
- Fitness goals integration (weight loss, muscle gain, maintenance)
- Supplement tracking and recommendations

**Family Meal Planning:**
- Multiple user profiles with different nutritional needs
- Balanced meal planning for households
- Example: Low-carb for user, higher-carb for spouse
- Shared inventory management

### 5. Meal Planning & Tracking
**Automated Meal Planning:**
- Weekly meal plan generation
- Daily meal suggestions
- Flexible planning (can adjust as needed)
- Shopping list generation for missing ingredients

**Meal Tracking (Optional):**
- Track which recipes were actually used
- Calorie and nutrition tracking
- Portion size monitoring
- Goal progress tracking

## Technical Requirements

### Tech Stack
- **Frontend**: Next.js with shadcn/ui and Tailwind CSS
- **Backend**: Convex (database and real-time functions)
- **Authentication**: Clerk
- **Deployment**: Vercel
- **Mobile**: React Native or PWA for photo recognition

### External API Integrations
**Priority 1 - Nutrition APIs:**
- Edamam Nutrition API
- Spoonacular Food API
- ESHA Research Database

**Priority 2 - Recipe APIs:**
- Spoonacular Recipe API
- Edamam Recipe API
- Custom AI recipe generation via Claude API

**Priority 3 - Additional APIs:**
- Grocery store APIs for pricing
- Barcode lookup APIs
- Photo recognition APIs (Google Vision, AWS Rekognition)

### Database Schema Extensions
Beyond the initial PlantUML design, we need:

```
UserInventory {
  userId: string
  ingredientId: string
  quantity: number
  unit: string
  location: 'fridge' | 'pantry' | 'freezer'
  expiryDate: date
  purchaseDate: date
  isFrozen: boolean
  thawDate?: date
}

UserHealthGoals {
  userId: string
  goalType: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'pregnancy' | 'health_condition'
  targetCalories: number
  macronutrientTargets: {
    protein: number
    carbs: number
    fat: number
  }
  dietaryRestrictions: string[]
  healthConditions: string[]
}

RecipeSubstitution {
  originalIngredientId: string
  substituteIngredientId: string
  substitutionRatio: number
  notes: string
}

FamilyProfile {
  familyId: string
  members: UserProfile[]
  sharedInventory: boolean
  mealPreferences: object
}

MealPlan {
  userId: string
  weekStartDate: date
  meals: {
    date: date
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    recipeId: string
    servings: number
  }[]
}
```

## User Experience Requirements

### Mobile-First Design
- Photo recognition as primary input method
- Quick inventory updates
- Push notifications for expiry alerts
- Offline capability for basic features

### Web Application
- Full meal planning interface
- Detailed nutrition tracking
- Recipe management and customization
- Family profile management

### Key User Flows
1. **Quick Inventory Update**: Photo → AI recognition → Confirm/Edit → Save
2. **Meal Planning**: View expiring items → Generate recipes → Plan week → Generate shopping list
3. **Cooking**: View planned recipe → Check ingredients → Cook → Mark as used
4. **Shopping**: View shopping list → Check off items → Update inventory

## Success Metrics
- Time saved on meal planning (target: 50% reduction)
- Food waste reduction (track unused expiring ingredients)
- User engagement (daily active usage)
- Recipe success rate (user satisfaction with generated recipes)
- Nutritional goal achievement rate

## Business Model

### Primary Revenue Streams
- **Subscription Model**: Tiered pricing based on features and family size
- **Affiliate Income**: Promote recipe books and cooking tools
- **Health Practitioner Marketplace**: Connect users with nutritionists, dietitians, and health coaches

### Subscription Tiers
- **Individual Plan**: Single user with basic features
- **Family Plan**: Up to 3 family members with shared inventory and individual health goals
- **Premium Features**: Advanced AI recipe generation, detailed nutrition tracking, meal planning

## Future Enhancements
- Health practitioner marketplace and consultations
- Affiliate marketing for recipe books and cooking tools
- Integration with fitness trackers
- Grocery delivery integration
- Meal prep batch cooking suggestions
- Seasonal ingredient recommendations
- Local farmer's market integration
