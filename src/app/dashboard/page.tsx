import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MP</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Meal Prep Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.firstName || user.emailAddresses[0].emailAddress}</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Inventory Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📦</span>
                </div>
                <span>My Inventory</span>
              </CardTitle>
              <CardDescription>
                Manage your ingredients and track expiry dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Items:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expiring Soon:</span>
                  <span className="font-medium text-orange-600">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Locations:</span>
                  <span className="font-medium">Fridge, Pantry, Freezer</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Inventory
              </Button>
            </CardContent>
          </Card>

          {/* Recipes Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-sm">🍳</span>
                </div>
                <span>Recipes</span>
              </CardTitle>
              <CardDescription>
                Generate AI recipes from your ingredients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Saved Recipes:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>AI Generated:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Favorites:</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Generate Recipe
              </Button>
            </CardContent>
          </Card>

          {/* Meal Planning Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-sm">📅</span>
                </div>
                <span>Meal Planning</span>
              </CardTitle>
              <CardDescription>
                Plan your weekly meals and generate shopping lists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Week:</span>
                  <span className="font-medium">0 meals</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Week:</span>
                  <span className="font-medium">Not planned</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shopping List:</span>
                  <span className="font-medium">0 items</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Plan Meals
              </Button>
            </CardContent>
          </Card>

          {/* Health Goals Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm">🎯</span>
                </div>
                <span>Health Goals</span>
              </CardTitle>
              <CardDescription>
                Track your nutrition and health progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Calories:</span>
                  <span className="font-medium">Not set</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Goal Type:</span>
                  <span className="font-medium">Not set</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span className="font-medium">0%</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Set Goals
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">⚡</span>
                </div>
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline" size="sm">
                  📱 Scan Barcode
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  📷 Take Photo
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  ➕ Add Ingredient
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-sm">📊</span>
                </div>
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Start by adding some ingredients!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
