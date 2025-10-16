# Mobile App Wireframes - Kitchen Table

## Overview

This document provides detailed wireframes for the mobile-first Kitchen Table app, focusing on the photo-based inventory management flow and user experience optimization.

## Design Principles

### Mobile-First Approach
- **One-Handed Operation**: All primary actions within thumb reach
- **Large Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Natural mobile interactions
- **Camera Integration**: Seamless photo capture experience
- **Offline Support**: Core functionality works without internet

### Visual Hierarchy
- **Primary Actions**: Prominent, high-contrast buttons
- **Secondary Actions**: Subtle, accessible but not distracting
- **Information Density**: Balanced content without overwhelming
- **Progressive Disclosure**: Show details when needed

## App Architecture

### Navigation Structure
```
Tab Navigation (Bottom)
├── 📱 Home (Dashboard)
├── 📷 Scan (Photo Capture)
├── 📦 Inventory
├── 🍳 Recipes
└── 👤 Profile
```

### Screen Flow
```
Onboarding → Dashboard → Photo Capture → Ingredient Review → Recipe Suggestions
     ↓              ↓           ↓              ↓                ↓
Preferences → Quick Add → Barcode Scan → Manual Entry → Meal Planning
```

## Detailed Wireframes

### 1. Onboarding Flow

#### Screen 1.1: Welcome Screen
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│                                     │
│           🍳                        │
│      Kitchen Table                  │
│                                     │
│    Smart Meal Planning              │
│      Made Simple                    │
│                                     │
│  Take photos of your fridge,        │
│  get personalized recipes,          │
│  and reduce food waste.             │
│                                     │
│                                     │
│  [Get Started]                      │
│                                     │
│  [Sign In]                          │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 1.2: Permission Request
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│           📷                        │
│                                     │
│    Camera Access                    │
│                                     │
│  We need camera access to help      │
│  you quickly add ingredients        │
│  by taking photos of your fridge,   │
│  pantry, and spice rack.            │
│                                     │
│  Your photos are processed          │
│  securely and deleted after         │
│  ingredient recognition.            │
│                                     │
│  [Allow Camera Access]              │
│                                     │
│  [Skip for Now]                     │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 1.3: Quick Survey - Dietary Preferences
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  ●●●○○○○ (3/7)                      │
│                                     │
│           🥗                        │
│                                     │
│  What describes your diet?          │
│                                     │
│  Select all that apply:             │
│                                     │
│  ☐ Vegetarian                      │
│  ☐ Vegan                           │
│  ☐ Gluten-Free                     │
│  ☐ Dairy-Free                      │
│  ☐ Keto/Low-Carb                   │
│  ☐ No restrictions                 │
│                                     │
│  [Continue]                         │
│                                     │
└─────────────────────────────────────┘
```

### 2. Main Dashboard

#### Screen 2.1: Home Dashboard
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  👋 Good morning, John!             │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📷 Quick Add                   │ │
│  │  Take a photo to add items      │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ⚠️ 3 items expiring soon           │
│  ┌─────────────────────────────────┐ │
│  │  🥛 Milk - Expires tomorrow     │ │
│  │  🥬 Lettuce - 2 days left       │ │
│  │  🍅 Tomatoes - 3 days left      │ │
│  └─────────────────────────────────┘ │
│                                     │
│  🍳 Suggested Recipes               │
│  ┌─────────────────────────────────┐ │
│  │  [Recipe Card 1]                │ │
│  │  [Recipe Card 2]                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [📱] [📷] [📦] [🍳] [👤]           │
└─────────────────────────────────────┘
```

### 3. Photo Capture Flow

#### Screen 3.1: Camera Interface
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │                                 │ │
│  │        Camera View              │ │
│  │                                 │ │
│  │                                 │ │
│  │                                 │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  📷 Fridge    📦 Pantry    🌶️ Spices │
│                                     │
│           [Capture]                 │
│                                     │
│  [Gallery] [Flash] [Settings]       │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 3.2: Photo Processing
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│           🔄                        │
│                                     │
│    Processing your photo...         │
│                                     │
│  We're identifying ingredients      │
│  in your photo. This usually        │
│  takes 10-15 seconds.               │
│                                     │
│  [Progress Bar: 60%]                │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 3.3: Ingredient Review
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  Review Detected Items              │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🥛 Milk                        │ │
│  │  Confidence: 95%                │ │
│  │  [✓] [✗] [Edit]                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🥬 Lettuce                     │ │
│  │  Confidence: 87%                │ │
│  │  [✓] [✗] [Edit]                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🍅 Tomatoes                    │ │
│  │  Confidence: 92%                │ │
│  │  [✓] [✗] [Edit]                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Add to Inventory]                 │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 3.4: Manual Ingredient Entry
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  Add Ingredient Manually            │
│                                     │
│  Ingredient Name:                   │
│  ┌─────────────────────────────────┐ │
│  │  [Text Input]                   │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Quantity:                          │
│  ┌─────────────────────────────────┐ │
│  │  [1] [2] [3] [4] [5]           │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Unit:                              │
│  ┌─────────────────────────────────┐ │
│  │  [Cups] [Pounds] [Each] [Ounces]│ │
│  └─────────────────────────────────┘ │
│                                     │
│  Location:                          │
│  ┌─────────────────────────────────┐ │
│  │  [Fridge] [Pantry] [Freezer]    │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Expiry Date:                       │
│  ┌─────────────────────────────────┐ │
│  │  [Date Picker]                  │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Add to Inventory]                 │
│                                     │
└─────────────────────────────────────┘
```

### 4. Inventory Management

#### Screen 4.1: Inventory Overview
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  My Inventory                       │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📊 12 items  ⚠️ 3 expiring     │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Fridge] [Pantry] [Freezer]        │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🥛 Milk                        │ │
│  │  1 gallon • Expires tomorrow    │ │
│  │  [Edit] [Delete]                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🥬 Lettuce                     │ │
│  │  1 head • 2 days left           │ │
│  │  [Edit] [Delete]                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🍅 Tomatoes                    │ │
│  │  6 pieces • 3 days left         │ │
│  │  [Edit] [Delete]                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [📱] [📷] [📦] [🍳] [👤]           │
└─────────────────────────────────────┘
```

#### Screen 4.2: Expiring Items Alert
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  ⚠️ Items Expiring Soon             │
│                                     │
│  These items need to be used        │
│  quickly to avoid waste:            │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🥛 Milk                        │ │
│  │  Expires tomorrow               │ │
│  │  [Find Recipes]                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🥬 Lettuce                     │ │
│  │  Expires in 2 days              │ │
│  │  [Find Recipes]                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🍅 Tomatoes                    │ │
│  │  Expires in 3 days              │ │
│  │  [Find Recipes]                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Plan Week with These Items]       │
│                                     │
└─────────────────────────────────────┘
```

### 5. Recipe Discovery

#### Screen 5.1: Recipe Suggestions
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  🍳 Recipe Suggestions              │
│                                     │
│  Based on your expiring items:      │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  [Recipe Image]                 │ │
│  │  Caprese Salad                  │ │
│  │  ⭐⭐⭐⭐⭐ 4.8 (234)              │ │
│  │  🕐 15 min • 👥 4 servings      │ │
│  │  Uses: Milk, Lettuce, Tomatoes  │ │
│  │  [View Recipe]                  │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  [Recipe Image]                 │ │
│  │  Fresh Garden Salad             │ │
│  │  ⭐⭐⭐⭐ 4.2 (89)                │ │
│  │  🕐 10 min • 👥 2 servings      │ │
│  │  Uses: Lettuce, Tomatoes        │ │
│  │  [View Recipe]                  │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [📱] [📷] [📦] [🍳] [👤]           │
└─────────────────────────────────────┘
```

#### Screen 5.2: Recipe Details
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  [Recipe Image]                 │ │
│  │  Caprese Salad                  │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ⭐⭐⭐⭐⭐ 4.8 (234) • 15 min        │ │
│                                     │
│  [Ingredients] [Instructions] [Nutrition] │
│                                     │
│  Ingredients:                       │
│  • 2 cups fresh lettuce            │
│  • 4 medium tomatoes               │
│  • 1 cup fresh mozzarella          │
│  • 2 tbsp olive oil                │
│  • Salt and pepper to taste        │
│                                     │
│  [Add to Meal Plan]                │
│  [Add to Shopping List]            │
│                                     │
└─────────────────────────────────────┘
```

### 6. Barcode Scanning

#### Screen 6.1: Barcode Scanner
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │        Scanner View             │ │
│  │                                 │ │
│  │    ┌─────────────────────────┐  │ │
│  │    │                         │  │ │
│  │    │    Barcode Target       │  │ │
│  │    │                         │  │ │
│  │    └─────────────────────────┘  │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Position barcode within the        │
│  frame to scan automatically        │
│                                     │
│  [Manual Entry] [Gallery]           │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 6.2: Product Found
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  ✅ Product Found!                  │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  [Product Image]                │ │
│  │  Organic Whole Milk             │ │
│  │  Horizon Organic                │ │
│  │  $4.99 • 1 gallon              │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Expiry Date:                       │
│  ┌─────────────────────────────────┐ │
│  │  [Date Picker]                  │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Location:                          │
│  ┌─────────────────────────────────┐ │
│  │  [Fridge] [Pantry] [Freezer]    │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Add to Inventory]                 │
│                                     │
└─────────────────────────────────────┘
```

### 7. User Profile & Settings

#### Screen 7.1: Profile Overview
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  [Profile Picture]              │ │
│  │  John Smith                     │ │
│  │  john@email.com                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  📊 My Stats                        │
│  • 47 items tracked                │
│  • 12 recipes cooked               │
│  • 3 weeks streak                  │
│                                     │
│  ⚙️ Settings                        │
│  • Dietary Preferences             │
│  • Notification Settings           │
│  • Privacy & Security              │
│  • Help & Support                  │
│                                     │
│  [Sign Out]                         │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 7.2: Dietary Preferences
```
┌─────────────────────────────────────┐
│  [Status Bar]                       │
├─────────────────────────────────────┤
│  ← Back                             │
│                                     │
│  Dietary Preferences                │
│                                     │
│  Dietary Restrictions:              │
│  ☐ Vegetarian                      │
│  ☐ Vegan                           │
│  ☐ Gluten-Free                     │
│  ☐ Dairy-Free                      │
│  ☐ Keto/Low-Carb                   │
│                                     │
│  Allergies:                         │
│  ☐ Nuts                            │
│  ☐ Shellfish                       │
│  ☐ Dairy                           │
│  ☐ Eggs                            │
│                                     │
│  Disliked Ingredients:              │
│  ┌─────────────────────────────────┐ │
│  │  [Text Input]                   │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Save Changes]                     │
│                                     │
└─────────────────────────────────────┘
```

## Interaction Patterns

### Gesture Support
- **Swipe Left/Right**: Navigate between inventory categories
- **Pull to Refresh**: Update inventory and recipe suggestions
- **Long Press**: Quick actions on inventory items
- **Pinch to Zoom**: Zoom in on recipe images
- **Swipe Up**: Access quick actions menu

### Accessibility Features
- **Voice Over**: Full screen reader support
- **Large Text**: Support for dynamic type sizes
- **High Contrast**: High contrast mode support
- **Voice Input**: Voice-to-text for ingredient entry
- **Haptic Feedback**: Tactile feedback for actions

### Error States
- **Network Error**: Offline mode with queued actions
- **Camera Error**: Fallback to manual entry
- **Recognition Error**: Manual confirmation required
- **API Error**: Graceful degradation with cached data

## Performance Considerations

### Image Optimization
- **Compression**: Automatic image compression before upload
- **Caching**: Local caching of processed images
- **Progressive Loading**: Load images progressively
- **Lazy Loading**: Load images only when needed

### Offline Support
- **Local Storage**: Cache inventory and preferences
- **Sync Queue**: Queue actions when offline
- **Background Sync**: Sync when connection restored
- **Offline Indicators**: Clear offline status indicators

This wireframe design ensures a smooth, intuitive mobile experience that makes inventory management as easy as taking a photo, while providing powerful recipe suggestions based on user preferences and available ingredients.
