"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  // Show loading while checking authentication
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

  // Don't render the landing page if user is logged in (will redirect)
  if (user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KT</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Kitchen Table</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Meal Planning
            <span className="text-green-600 block">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Generate AI-powered recipes from your available ingredients, track expiry dates, 
            and plan nutritious meals that fit your health goals.
          </p>
          <div className="flex justify-center space-x-4">
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Planning
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📱</span>
                </div>
                <span>Smart Inventory</span>
              </CardTitle>
              <CardDescription>
                Track ingredients with photo recognition, barcode scanning, and expiry alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Photo recognition for easy entry</li>
                <li>• Barcode scanning for packaged items</li>
                <li>• Expiry date tracking and alerts</li>
                <li>• Location-based organization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-sm">🤖</span>
                </div>
                <span>AI Recipe Generation</span>
              </CardTitle>
              <CardDescription>
                Get personalized recipes based on your available ingredients and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• AI-powered recipe suggestions</li>
                <li>• Prioritize expiring ingredients</li>
                <li>• Dietary restriction support</li>
                <li>• Nutritional analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-sm">🎯</span>
                </div>
                <span>Health Goals</span>
              </CardTitle>
              <CardDescription>
                Track nutrition and achieve your health goals with personalized meal plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Personalized nutrition tracking</li>
                <li>• Health goal integration</li>
                <li>• Family meal planning</li>
                <li>• Shopping list generation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Meal Planning?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of users who are saving time, reducing waste, and eating healthier.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Get Started Free
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}