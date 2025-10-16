# Recipe API Research & Cost Analysis

## Executive Summary

This document provides a comprehensive analysis of recipe APIs and AI solutions for the meal prep app, focusing on cost-effectiveness, capabilities, and integration feasibility.

## API Comparison Matrix

| API | Free Tier | Paid Pricing | Ingredient Search | Nutrition Data | Dietary Filters | Recipe Quality | Integration Ease |
|-----|-----------|--------------|-------------------|----------------|-----------------|----------------|------------------|
| **Spoonacular** | 150 requests/day | $0.01/request | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Edamam Recipe** | 10 requests/min | $0.10/request | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **TheMealDB** | Unlimited | Free | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Claude AI** | $0.03/request | $0.03/request | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## Detailed API Analysis

### 1. Spoonacular API (Recommended Primary)

**Strengths:**
- Excellent ingredient-based recipe search
- Comprehensive nutrition data
- Advanced dietary filtering
- High-quality recipe database
- Easy integration with detailed documentation
- Free tier: 150 requests/day (4,500/month)

**Capabilities:**
- **Ingredient Search**: `findByIngredients` endpoint
- **Nutrition Analysis**: Detailed macro/micro nutrients
- **Dietary Filters**: Vegetarian, vegan, gluten-free, keto, etc.
- **Cuisine Types**: 20+ cuisine types supported
- **Meal Types**: Breakfast, lunch, dinner, snack
- **Cooking Time**: Filter by prep/cook time
- **Recipe Details**: Full instructions, ingredients, nutrition

**Cost Analysis:**
- **Free Tier**: 150 requests/day = 4,500 requests/month
- **Paid Tier**: $0.01 per request
- **Monthly Cost**: $0-45 (depending on usage)

**Integration Example:**
```typescript
// Search recipes by available ingredients
const response = await fetch(
  `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=10&ranking=1&ignorePantry=false`,
  {
    headers: {
      'X-API-Key': process.env.SPOONACULAR_API_KEY
    }
  }
);
```

### 2. Edamam Recipe API (Recommended Secondary)

**Strengths:**
- High-quality nutrition data
- Good recipe variety
- Dietary filtering support
- Reliable API performance

**Capabilities:**
- **Recipe Search**: Text-based search with filters
- **Nutrition Data**: Comprehensive nutritional analysis
- **Dietary Filters**: Health and diet labels
- **Cuisine Support**: Multiple cuisine types
- **Meal Planning**: Recipe recommendations

**Cost Analysis:**
- **Free Tier**: 10 requests/minute = 14,400 requests/day
- **Paid Tier**: $0.10 per request
- **Monthly Cost**: $0-432 (depending on usage)

**Limitations:**
- No direct ingredient-based search
- Higher cost per request
- Less flexible than Spoonacular

### 3. TheMealDB (Free Alternative)

**Strengths:**
- Completely free
- Simple integration
- Good for basic recipe data

**Limitations:**
- Limited ingredient search capabilities
- Basic nutrition data
- No dietary filtering
- Smaller recipe database

**Use Case:** Fallback for basic recipe information when other APIs are unavailable.

### 4. Claude AI (Fallback Only)

**Strengths:**
- Highly personalized recipe generation
- Can work with any ingredient combination
- Understands complex dietary requirements
- Creative recipe suggestions

**Cost Analysis:**
- **Cost**: $0.03 per request (as mentioned by user)
- **Monthly Cost**: $30-150 (1,000-5,000 requests)

**Use Case:** Only when recipe APIs don't have suitable options for unique ingredient combinations.

## Cost Optimization Strategy

### Tiered Approach
1. **Primary**: Spoonacular API (free tier + paid)
2. **Secondary**: Edamam API (free tier only)
3. **Fallback**: Claude AI (minimal usage)

### Cost Control Measures
1. **Caching**: Cache recipe results for 24 hours
2. **User Limits**: 50 recipe requests per user per day
3. **Smart Fallback**: Only use AI when APIs fail
4. **Batch Processing**: Process multiple requests together

### Monthly Cost Projections

| User Count | Spoonacular (Free) | Spoonacular (Paid) | Edamam (Free) | Claude AI | Total Cost |
|------------|-------------------|-------------------|---------------|-----------|------------|
| 100 users  | $0               | $15              | $0            | $5        | $20        |
| 500 users  | $0               | $75              | $0            | $25       | $100       |
| 1,000 users| $0               | $150             | $0            | $50       | $200       |
| 5,000 users| $0               | $750             | $0            | $250      | $1,000     |

## Implementation Strategy

### Phase 1: Basic Recipe Search (Weeks 1-4)
- Integrate Spoonacular API
- Implement ingredient-based search
- Add basic recipe display
- Implement caching system

### Phase 2: Enhanced Features (Weeks 5-8)
- Add Edamam API as secondary source
- Implement dietary filtering
- Add nutrition data display
- Create recipe recommendation engine

### Phase 3: AI Integration (Weeks 9-12)
- Integrate Claude AI as fallback
- Implement cost controls
- Add personalized recipe generation
- Create usage analytics

## API Integration Architecture

```typescript
class RecipeService {
  async findRecipes(ingredients: string[], preferences: UserPreferences) {
    // Try Spoonacular first
    try {
      const recipes = await this.spoonacularAPI.findByIngredients(ingredients, preferences);
      if (recipes.length > 0) {
        return recipes;
      }
    } catch (error) {
      console.log('Spoonacular API failed, trying Edamam');
    }

    // Try Edamam as secondary
    try {
      const recipes = await this.edamamAPI.search(ingredients, preferences);
      if (recipes.length > 0) {
        return recipes;
      }
    } catch (error) {
      console.log('Edamam API failed, using AI fallback');
    }

    // Use Claude AI as last resort
    if (this.canUseAI()) {
      return await this.claudeAPI.generateRecipes(ingredients, preferences);
    }

    return [];
  }

  private canUseAI(): boolean {
    // Check daily AI usage limits
    return this.dailyAIUsage < this.maxDailyAIUsage;
  }
}
```

## Quality Metrics

### Recipe Quality Assessment
- **User Ratings**: Track user feedback on suggested recipes
- **Cooking Success Rate**: Monitor which recipes users actually cook
- **Repeat Usage**: Track recipes users make multiple times
- **Nutrition Accuracy**: Validate nutrition data against user feedback

### API Performance Metrics
- **Response Time**: Target < 2 seconds for recipe search
- **Success Rate**: Target > 95% successful API calls
- **Cost per Recipe**: Track cost efficiency
- **User Satisfaction**: Monitor user engagement with recipes

## Recommendations

### Primary Recommendation: Spoonacular API
- **Rationale**: Best balance of features, cost, and quality
- **Implementation**: Start with free tier, scale to paid as needed
- **Integration**: Full integration with ingredient search and nutrition data

### Secondary Recommendation: Edamam API
- **Rationale**: Good nutrition data and recipe quality
- **Implementation**: Use free tier only for additional recipe variety
- **Integration**: Limited integration for nutrition analysis

### AI Fallback: Claude API
- **Rationale**: Creative recipe generation for unique combinations
- **Implementation**: Strict usage limits to control costs
- **Integration**: Minimal integration, only when APIs fail

### Cost Management
- **Target**: Keep total API costs under $200/month for first 1,000 users
- **Strategy**: Aggressive caching and user limits
- **Monitoring**: Real-time cost tracking and alerts

## Next Steps

1. **API Key Setup**: Obtain Spoonacular API key and test integration
2. **Caching System**: Implement Redis or Convex-based caching
3. **User Limits**: Implement per-user request limits
4. **Monitoring**: Set up cost and usage monitoring
5. **Testing**: Test API reliability and response times
6. **Fallback Logic**: Implement graceful fallback between APIs

This strategy ensures we provide high-quality recipe recommendations while maintaining cost control and system reliability.
