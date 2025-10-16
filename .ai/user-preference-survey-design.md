# User Preference Survey System Design

## Overview

The user preference survey system is designed to gather comprehensive user preferences in a quick, engaging way to enable personalized recipe recommendations. The system uses progressive disclosure and smart defaults to minimize user effort while maximizing personalization value.

## Survey Strategy

### Progressive Disclosure Approach
- **Onboarding Survey**: 5-7 essential questions (2-3 minutes)
- **Contextual Surveys**: 1-2 questions during natural app usage
- **Preference Refinement**: Ongoing feedback collection
- **Annual Deep Dive**: Comprehensive preference update

### Survey Timing
1. **Onboarding**: After account creation, before first recipe search
2. **Post-Recipe**: After user cooks a recipe (rating and feedback)
3. **Weekly Check-in**: Quick preference updates
4. **Seasonal**: Adjust preferences for seasonal ingredients

## Onboarding Survey Design

### Screen 1: Welcome & Purpose
```
┌─────────────────────────────────────┐
│  🍳 Welcome to Kitchen Table!      │
│                                     │
│  Let's personalize your experience  │
│  by learning about your preferences │
│                                     │
│  This takes just 2-3 minutes and   │
│  helps us suggest better recipes    │
│                                     │
│  [Get Started] [Skip for Now]      │
└─────────────────────────────────────┘
```

### Screen 2: Dietary Preferences
```
┌─────────────────────────────────────┐
│  🥗 What describes your diet?       │
│                                     │
│  Select all that apply:             │
│                                     │
│  ☐ Vegetarian                      │
│  ☐ Vegan                           │
│  ☐ Gluten-Free                     │
│  ☐ Dairy-Free                      │
│  ☐ Keto/Low-Carb                   │
│  ☐ Paleo                           │
│  ☐ Mediterranean                   │
│  ☐ No restrictions                 │
│                                     │
│  [Continue]                        │
└─────────────────────────────────────┘
```

### Screen 3: Cuisine Preferences
```
┌─────────────────────────────────────┐
│  🌍 What cuisines do you enjoy?     │
│                                     │
│  Select your favorites:             │
│                                     │
│  ☐ Italian    ☐ Asian              │
│  ☐ Mexican    ☐ Mediterranean      │
│  ☐ American   ☐ Indian             │
│  ☐ French     ☐ Thai               │
│  ☐ Chinese    ☐ Japanese           │
│  ☐ Other: [text input]             │
│                                     │
│  [Continue]                        │
└─────────────────────────────────────┘
```

### Screen 4: Cooking Skill & Time
```
┌─────────────────────────────────────┐
│  👨‍🍳 How would you describe yourself? │
│                                     │
│  Cooking Level:                     │
│  ○ Beginner (learning basics)       │
│  ○ Intermediate (comfortable)       │
│  ○ Advanced (love experimenting)    │
│                                     │
│  Time Available:                    │
│  ☐ Quick meals (15-30 min)         │
│  ☐ Medium meals (30-60 min)        │
│  ☐ Elaborate meals (60+ min)       │
│                                     │
│  [Continue]                        │
└─────────────────────────────────────┘
```

### Screen 5: Health Goals
```
┌─────────────────────────────────────┐
│  🎯 What are your health goals?     │
│                                     │
│  Primary Goal:                      │
│  ○ Weight Loss                      │
│  ○ Muscle Gain                      │
│  ○ Maintain Health                  │
│  ○ Specific Health Condition        │
│  ○ No specific goals                │
│                                     │
│  Family Size:                       │
│  [1] [2] [3] [4] [5+] people       │
│                                     │
│  [Continue]                        │
└─────────────────────────────────────┘
```

### Screen 6: Allergies & Dislikes
```
┌─────────────────────────────────────┐
│  ⚠️ Any allergies or strong dislikes? │
│                                     │
│  Allergies:                         │
│  ☐ Nuts        ☐ Shellfish         │
│  ☐ Dairy       ☐ Eggs              │
│  ☐ Gluten      ☐ Soy               │
│  ☐ Other: [text input]             │
│                                     │
│  Disliked Ingredients:              │
│  [text input for specific items]    │
│                                     │
│  [Continue]                        │
└─────────────────────────────────────┘
```

### Screen 7: Meal Preferences
```
┌─────────────────────────────────────┐
│  🍽️ Which meals do you plan?        │
│                                     │
│  ☐ Breakfast                       │
│  ☐ Lunch                           │
│  ☐ Dinner                          │
│  ☐ Snacks                          │
│                                     │
│  [Finish Setup]                    │
└─────────────────────────────────────┘
```

## Contextual Survey Design

### Post-Recipe Feedback
```
┌─────────────────────────────────────┐
│  How was this recipe?               │
│                                     │
│  ⭐⭐⭐⭐⭐ (5 stars)                │
│                                     │
│  Difficulty:                        │
│  ○ Too Easy  ○ Just Right  ○ Too Hard │
│                                     │
│  Would you make it again?           │
│  ○ Yes  ○ No  ○ Maybe              │
│                                     │
│  [Submit] [Skip]                   │
└─────────────────────────────────────┘
```

### Weekly Preference Check
```
┌─────────────────────────────────────┐
│  Quick check-in!                    │
│                                     │
│  How are you feeling about:         │
│                                     │
│  Recipe suggestions:                │
│  ○ Too many  ○ Just right  ○ Too few │
│                                     │
│  Cooking time:                      │
│  ○ Need quicker  ○ Good  ○ Want more │
│                                     │
│  [Update] [Skip]                   │
└─────────────────────────────────────┘
```

## Data Structure

### UserPreferences Interface
```typescript
interface UserPreferences {
  // Dietary Information
  dietaryRestrictions: string[];
  allergies: string[];
  dislikedIngredients: string[];
  
  // Cuisine & Cooking
  cuisinePreferences: string[];
  cookingSkillLevel: "beginner" | "intermediate" | "advanced";
  preferredCookingMethods: string[];
  
  // Time & Family
  timeConstraints: {
    quickMeals: boolean;
    mediumMeals: boolean;
    elaborateMeals: boolean;
  };
  familySize: number;
  
  // Health Goals
  healthGoals: {
    type: "weight_loss" | "muscle_gain" | "maintenance" | "health_condition";
    targetCalories?: number;
    macronutrientTargets?: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  
  // Meal Planning
  mealPreferences: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: boolean;
  };
  
  // Learning Data
  recipeRatings: Map<string, number>;
  cookingSuccessRate: number;
  preferredRecipeTypes: string[];
  
  // Metadata
  surveyCompletionDate: number;
  lastUpdated: number;
  surveyVersion: string;
}
```

## Personalization Algorithm

### Recipe Scoring System
```typescript
class RecipePersonalizationEngine {
  scoreRecipe(recipe: Recipe, userPreferences: UserPreferences): number {
    let score = 0;
    
    // Dietary restrictions (critical - can't be overridden)
    if (this.violatesDietaryRestrictions(recipe, userPreferences)) {
      return 0;
    }
    
    // Cuisine preference (high weight)
    score += this.getCuisineScore(recipe, userPreferences.cuisinePreferences) * 0.3;
    
    // Cooking skill match (high weight)
    score += this.getSkillScore(recipe, userPreferences.cookingSkillLevel) * 0.25;
    
    // Time constraints (medium weight)
    score += this.getTimeScore(recipe, userPreferences.timeConstraints) * 0.2;
    
    // Health goals (medium weight)
    score += this.getHealthScore(recipe, userPreferences.healthGoals) * 0.15;
    
    // User feedback (high weight for learned preferences)
    score += this.getFeedbackScore(recipe, userPreferences) * 0.1;
    
    return Math.min(score, 1.0);
  }
  
  private getCuisineScore(recipe: Recipe, preferences: string[]): number {
    if (preferences.length === 0) return 0.5; // Neutral if no preferences
    
    const recipeCuisines = recipe.cuisineTypes || [];
    const matches = recipeCuisines.filter(cuisine => 
      preferences.includes(cuisine.toLowerCase())
    );
    
    return matches.length / preferences.length;
  }
  
  private getSkillScore(recipe: Recipe, skillLevel: string): number {
    const difficultyMap = {
      beginner: { easy: 1.0, medium: 0.3, hard: 0.0 },
      intermediate: { easy: 0.7, medium: 1.0, hard: 0.4 },
      advanced: { easy: 0.4, medium: 0.8, hard: 1.0 }
    };
    
    return difficultyMap[skillLevel][recipe.difficulty] || 0.5;
  }
  
  private getTimeScore(recipe: Recipe, timeConstraints: any): number {
    const totalTime = recipe.prepTime + recipe.cookTime;
    
    if (totalTime <= 30 && timeConstraints.quickMeals) return 1.0;
    if (totalTime <= 60 && timeConstraints.mediumMeals) return 1.0;
    if (totalTime > 60 && timeConstraints.elaborateMeals) return 1.0;
    
    return 0.5; // Neutral score
  }
}
```

## Survey Implementation

### Progressive Web App Integration
```typescript
class SurveyManager {
  private currentStep = 0;
  private surveyData: Partial<UserPreferences> = {};
  
  async startOnboardingSurvey(): Promise<UserPreferences> {
    // Show welcome screen
    await this.showWelcomeScreen();
    
    // Progressive survey steps
    this.surveyData.dietaryRestrictions = await this.showDietaryScreen();
    this.surveyData.cuisinePreferences = await this.showCuisineScreen();
    this.surveyData.cookingSkillLevel = await this.showSkillScreen();
    this.surveyData.healthGoals = await this.showHealthScreen();
    this.surveyData.allergies = await this.showAllergiesScreen();
    this.surveyData.mealPreferences = await this.showMealScreen();
    
    // Save preferences
    return await this.saveUserPreferences(this.surveyData);
  }
  
  async showContextualSurvey(context: string): Promise<void> {
    switch (context) {
      case 'post-recipe':
        await this.showRecipeFeedback();
        break;
      case 'weekly-check':
        await this.showWeeklyCheck();
        break;
      case 'seasonal-update':
        await this.showSeasonalUpdate();
        break;
    }
  }
}
```

### Mobile App Integration
```typescript
// React Native implementation
const OnboardingSurvey = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({});
  
  const steps = [
    WelcomeScreen,
    DietaryScreen,
    CuisineScreen,
    SkillScreen,
    HealthScreen,
    AllergiesScreen,
    MealScreen
  ];
  
  const CurrentStepComponent = steps[currentStep];
  
  return (
    <View style={styles.container}>
      <ProgressBar progress={currentStep / steps.length} />
      <CurrentStepComponent 
        onNext={(data) => {
          setPreferences({...preferences, ...data});
          setCurrentStep(currentStep + 1);
        }}
        onBack={() => setCurrentStep(currentStep - 1)}
      />
    </View>
  );
};
```

## Analytics & Learning

### Survey Analytics
```typescript
interface SurveyAnalytics {
  completionRate: number;
  averageTimeToComplete: number;
  dropOffPoints: string[];
  mostSelectedOptions: {
    dietaryRestrictions: string[];
    cuisinePreferences: string[];
    healthGoals: string[];
  };
  userFeedback: {
    helpfulness: number;
    easeOfUse: number;
    suggestions: string[];
  };
}
```

### Preference Learning
```typescript
class PreferenceLearningEngine {
  async updatePreferencesFromBehavior(
    userId: string, 
    behavior: UserBehavior
  ): Promise<void> {
    const preferences = await this.getUserPreferences(userId);
    
    // Learn from recipe ratings
    if (behavior.recipeRating) {
      this.updateCuisinePreferences(preferences, behavior.recipe);
      this.updateSkillLevel(preferences, behavior.recipe);
      this.updateTimePreferences(preferences, behavior.recipe);
    }
    
    // Learn from cooking success
    if (behavior.cookingSuccess) {
      this.updatePreferredIngredients(preferences, behavior.recipe);
      this.updateCookingMethods(preferences, behavior.recipe);
    }
    
    await this.saveUserPreferences(userId, preferences);
  }
}
```

## Best Practices

### Survey Design Principles
1. **Keep it Short**: Maximum 7 questions for onboarding
2. **Use Visual Elements**: Icons, images, and progress indicators
3. **Smart Defaults**: Pre-select common options
4. **Allow Skipping**: Never force completion
5. **Show Progress**: Clear indication of completion status
6. **Mobile-First**: Optimize for mobile screens
7. **Accessibility**: Support screen readers and keyboard navigation

### Data Privacy
1. **Transparent Collection**: Explain why each question is asked
2. **User Control**: Allow users to update or delete preferences
3. **Data Minimization**: Only collect necessary data
4. **Secure Storage**: Encrypt sensitive preference data
5. **GDPR Compliance**: Allow data export and deletion

### Engagement Strategies
1. **Gamification**: Progress bars, completion badges
2. **Personalization Preview**: Show how preferences will be used
3. **Social Proof**: "Join 10,000+ users who've personalized their experience"
4. **Incentives**: Unlock features after completing survey
5. **Follow-up**: Send personalized recipe suggestions after completion

## Success Metrics

### Survey Performance
- **Completion Rate**: Target > 80% for onboarding survey
- **Time to Complete**: Target < 3 minutes
- **User Satisfaction**: Target > 4.5/5 rating
- **Data Quality**: Target > 90% valid responses

### Personalization Effectiveness
- **Recipe Relevance**: Target > 70% of suggested recipes are rated 4+ stars
- **User Engagement**: Target > 60% of users cook suggested recipes
- **Preference Accuracy**: Target > 80% accuracy in predicting user preferences
- **Retention**: Target > 40% improvement in user retention with personalization

This survey system ensures we gather comprehensive user preferences while maintaining a smooth, engaging user experience that leads to highly personalized recipe recommendations.
