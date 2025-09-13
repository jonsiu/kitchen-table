# Phase 5: Lightweight Specs & Rules

## Overview
Define lightweight specifications, development guidelines, and quality rules that ensure consistent, maintainable, and scalable code while keeping documentation minimal and focused.

## Development Philosophy

### Core Principles
- **Simplicity**: Keep code simple and readable
- **Consistency**: Follow established patterns and conventions
- **Quality**: Maintain high standards without over-engineering
- **Speed**: Optimize for development velocity
- **Maintainability**: Write code that's easy to understand and modify

### Documentation Strategy
- **Just Enough**: Document what's necessary, not everything
- **Living Docs**: Keep documentation updated with code changes
- **Examples**: Show, don't just tell
- **Context**: Explain why, not just what

## Coding Standards

### TypeScript Guidelines

#### Type Safety
```typescript
// ✅ Good: Explicit types
interface UserInventory {
  userId: string;
  ingredientId: string;
  quantity: number;
  expiryDate?: Date;
}

// ❌ Bad: Any types
const inventory: any = { ... };
```

#### Function Design
```typescript
// ✅ Good: Pure functions with clear inputs/outputs
function calculateExpiryPriority(expiryDate: Date): 'critical' | 'warning' | 'normal' {
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 2) return 'critical';
  if (daysUntilExpiry <= 5) return 'warning';
  return 'normal';
}

// ❌ Bad: Side effects and unclear purpose
function processInventory(item: any) {
  // Complex logic with side effects
}
```

#### Error Handling
```typescript
// ✅ Good: Explicit error handling
async function generateRecipe(ingredients: string[]): Promise<Recipe | null> {
  try {
    const response = await claudeAPI.generateRecipe(ingredients);
    return parseRecipeResponse(response);
  } catch (error) {
    console.error('Recipe generation failed:', error);
    return null;
  }
}

// ❌ Bad: Silent failures
async function generateRecipe(ingredients: string[]) {
  const response = await claudeAPI.generateRecipe(ingredients);
  return response; // What if this fails?
}
```

### React/Next.js Guidelines

#### Component Structure
```typescript
// ✅ Good: Clear component structure
interface InventoryItemProps {
  item: InventoryItem;
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
  onDelete: (id: string) => void;
}

export function InventoryItem({ item, onUpdate, onDelete }: InventoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = useCallback((updates: Partial<InventoryItem>) => {
    onUpdate(item.id, updates);
    setIsEditing(false);
  }, [item.id, onUpdate]);
  
  return (
    <div className="inventory-item">
      {/* Component content */}
    </div>
  );
}
```

#### State Management
```typescript
// ✅ Good: Local state for UI, Convex for data
function InventoryList() {
  const [searchTerm, setSearchTerm] = useState('');
  const inventory = useQuery(api.inventory.getUserInventory, { userId: user.id });
  
  const filteredInventory = useMemo(() => {
    return inventory?.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];
  }, [inventory, searchTerm]);
  
  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search inventory..."
      />
      {filteredInventory.map(item => (
        <InventoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Convex Guidelines

#### Query Functions
```typescript
// ✅ Good: Clear query with proper typing
export const getUserInventory = query({
  args: { 
    userId: v.string(),
    location: v.optional(v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer")))
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db
      .query("userInventory")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    if (args.location) {
      return inventory.filter(item => item.location === args.location);
    }
    
    return inventory;
  },
});
```

#### Mutation Functions
```typescript
// ✅ Good: Clear mutation with validation
export const addToInventory = mutation({
  args: {
    ingredientId: v.id("ingredients"),
    quantity: v.number(),
    unit: v.string(),
    location: v.union(v.literal("fridge"), v.literal("pantry"), v.literal("freezer")),
    expiryDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Validate ingredient exists
    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient) {
      throw new Error("Ingredient not found");
    }
    
    // Add to inventory
    const inventoryId = await ctx.db.insert("userInventory", {
      userId: identity.subject,
      ingredientId: args.ingredientId,
      quantity: args.quantity,
      unit: args.unit,
      location: args.location,
      expiryDate: args.expiryDate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return inventoryId;
  },
});
```

## API Design Rules

### RESTful Principles
- **Clear Endpoints**: Use descriptive, consistent naming
- **HTTP Methods**: Use appropriate methods (GET, POST, PUT, DELETE)
- **Status Codes**: Return meaningful HTTP status codes
- **Error Responses**: Consistent error response format

### Response Format
```typescript
// ✅ Good: Consistent response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: number;
    requestId: string;
  };
}

// Example usage
const response: ApiResponse<Recipe[]> = {
  success: true,
  data: recipes,
  meta: {
    timestamp: Date.now(),
    requestId: "req_123"
  }
};
```

### Error Handling
```typescript
// ✅ Good: Consistent error handling
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage
throw new ApiError(
  'INGREDIENT_NOT_FOUND',
  'The requested ingredient could not be found',
  404,
  { ingredientId: 'ing_123' }
);
```

## Database Rules

### Schema Design
- **Consistent Naming**: Use camelCase for fields, PascalCase for types
- **Required Fields**: Mark required fields explicitly
- **Indexes**: Create indexes for frequently queried fields
- **Relationships**: Use proper foreign key relationships

### Data Validation
```typescript
// ✅ Good: Comprehensive validation
const ingredientSchema = v.object({
  name: v.string(),
  category: v.string(),
  nutritionPer100g: v.object({
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
  }),
  commonUnits: v.array(v.string()),
  barcode: v.optional(v.string()),
  createdAt: v.number(),
});
```

### Performance Rules
- **Query Optimization**: Use indexes and limit results
- **Caching**: Cache frequently accessed data
- **Pagination**: Implement pagination for large datasets
- **Real-time Updates**: Use Convex subscriptions efficiently

## Testing Guidelines

### Unit Testing
```typescript
// ✅ Good: Clear, focused unit tests
describe('calculateExpiryPriority', () => {
  it('should return critical for items expiring in 1 day', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const result = calculateExpiryPriority(tomorrow);
    
    expect(result).toBe('critical');
  });
  
  it('should return warning for items expiring in 3 days', () => {
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);
    
    const result = calculateExpiryPriority(threeDays);
    
    expect(result).toBe('warning');
  });
});
```

### Integration Testing
```typescript
// ✅ Good: Test API endpoints
describe('Inventory API', () => {
  it('should add item to inventory', async () => {
    const response = await request(app)
      .post('/api/inventory')
      .send({
        ingredientId: 'ing_123',
        quantity: 2,
        unit: 'cups',
        location: 'fridge'
      })
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

## Quality Assurance Rules

### Code Review Checklist
- [ ] Code follows established patterns and conventions
- [ ] Functions are small and focused
- [ ] Error handling is comprehensive
- [ ] Tests cover new functionality
- [ ] Documentation is updated
- [ ] Performance implications considered
- [ ] Security implications reviewed

### Performance Standards
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Database Queries**: < 100ms
- **Image Loading**: < 1 second
- **Mobile Performance**: 60fps interactions

### Security Rules
- **Authentication**: All protected routes require authentication
- **Authorization**: Users can only access their own data
- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: No sensitive information in error messages
- **Rate Limiting**: Implement rate limiting for API endpoints

## Deployment Rules

### Environment Management
- **Development**: Local development with mock data
- **Staging**: Production-like environment for testing
- **Production**: Live environment with monitoring

### Release Process
1. **Feature Branch**: Create feature branch from main
2. **Development**: Implement feature with tests
3. **Code Review**: Peer review of changes
4. **Testing**: Run full test suite
5. **Staging**: Deploy to staging environment
6. **QA**: Quality assurance testing
7. **Production**: Deploy to production
8. **Monitoring**: Monitor for issues

### Monitoring & Alerts
- **Error Tracking**: Monitor and alert on errors
- **Performance**: Track response times and throughput
- **Usage**: Monitor API usage and costs
- **Uptime**: Track service availability

## Success Criteria
- Code is consistent and maintainable
- Tests provide good coverage
- Performance meets standards
- Security best practices followed
- Documentation is current and useful
- Deployment process is reliable

## Next Phase
Lightweight specs and rules will guide the tasks plan and implementation in Phase 6, ensuring consistent, high-quality development practices.
