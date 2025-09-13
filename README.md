# Meal Prep App

A smart meal planning application that generates AI-powered recipes based on available ingredients, tracks expiry dates, and supports personalized nutrition goals.

## 🚀 Features

- **Smart Inventory Management**: Track ingredients with photo recognition, barcode scanning, and expiry alerts
- **AI Recipe Generation**: Generate personalized recipes using Claude API based on available ingredients
- **Meal Planning**: Plan weekly meals and generate shopping lists
- **Health Goals**: Track nutrition and achieve personalized health goals
- **Family Support**: Multi-user profiles with individual dietary preferences

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Clerk
- **AI**: Claude API for recipe generation
- **Deployment**: Vercel
- **Mobile**: React Native (future)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account
- Clerk account

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd meal-prep
npm install
```

### 2. Set up Convex

The Convex project has already been initialized. You should have a `.env.local` file with:
```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment_name
```

### 3. Set up Clerk Authentication

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Update your `.env.local` file with your Clerk keys:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and providers
│   └── convex-provider.tsx
convex/                   # Convex backend functions
├── schema.ts             # Database schema
├── users.ts              # User management functions
└── ingredients.ts        # Ingredient management functions
```

## 🗄 Database Schema

The app uses Convex with the following main tables:
- `users` - User profiles and authentication
- `ingredients` - Ingredient database
- `userInventory` - User's ingredient inventory
- `recipes` - Recipe storage
- `mealPlans` - Weekly meal planning
- `userHealthGoals` - Personal health goals

## 🔄 Development Workflow

1. **Database Changes**: Update `convex/schema.ts` and run `npx convex dev`
2. **New Features**: Create new Convex functions in the `convex/` directory
3. **UI Components**: Use shadcn/ui components or create custom ones
4. **Authentication**: Use Clerk hooks and components for auth

## 📱 Mobile Development

The mobile app will be built with React Native and will include:
- Camera integration for photo recognition
- Barcode scanning
- Offline inventory management
- Push notifications for expiry alerts

## 🎯 Roadmap

### Phase 1: Foundation (Weeks 1-4)
- ✅ Project setup and basic structure
- ✅ Authentication and database setup
- 🔄 Basic inventory management
- ⏳ Expiry tracking and alerts
- ⏳ Barcode scanning integration

### Phase 2: AI Integration (Weeks 5-8)
- ⏳ Claude API integration
- ⏳ Recipe generation system
- ⏳ Recipe-inventory matching
- ⏳ External recipe APIs

### Phase 3: Advanced Features (Weeks 9-16)
- ⏳ Nutrition tracking
- ⏳ Meal planning system
- ⏳ Family profiles
- ⏳ Photo recognition

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@mealprepapp.com or join our Discord community.

---

Built with ❤️ using Next.js, Convex, and Clerk.