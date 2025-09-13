"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, AlertTriangle, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import AddInventoryItem from "@/components/AddInventoryItem";
import { useUserSync } from "@/hooks/useUserSync";

export default function InventoryPage() {
  const { user, isLoaded } = useUser();
  const [showAddItem, setShowAddItem] = useState(false);
  const { isUserSynced } = useUserSync();

  const inventoryStats = useQuery(api.userInventory.getInventoryStats, 
    user ? { 
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || undefined,
      imageUrl: user.imageUrl || undefined
    } : "skip"
  );
  
  const expiringItems = useQuery(api.userInventory.getExpiringItems,
    user ? { 
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || undefined,
      imageUrl: user.imageUrl || undefined
    } : "skip"
  );

  const fridgeItems = useQuery(api.userInventory.getInventoryByLocation,
    user ? { 
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || undefined,
      imageUrl: user.imageUrl || undefined,
      location: "fridge"
    } : "skip"
  );

  const pantryItems = useQuery(api.userInventory.getInventoryByLocation,
    user ? { 
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || undefined,
      imageUrl: user.imageUrl || undefined,
      location: "pantry"
    } : "skip"
  );

  const freezerItems = useQuery(api.userInventory.getInventoryByLocation,
    user ? { 
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || undefined,
      imageUrl: user.imageUrl || undefined,
      location: "freezer"
    } : "skip"
  );

  if (!isLoaded || !isUserSynced) {
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
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your inventory</h1>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getExpiryStatus = (expiryDate?: number) => {
    if (!expiryDate) return { status: "no-date", color: "gray", text: "No expiry date" };
    
    const now = Date.now();
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: "expired", color: "red", text: "Expired" };
    if (daysUntilExpiry <= 1) return { status: "critical", color: "red", text: "Expires today" };
    if (daysUntilExpiry <= 3) return { status: "warning", color: "orange", text: `${daysUntilExpiry} days left` };
    if (daysUntilExpiry <= 7) return { status: "caution", color: "yellow", text: `${daysUntilExpiry} days left` };
    return { status: "good", color: "green", text: `${daysUntilExpiry} days left` };
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const InventoryItem = ({ item }: { item: any }) => {
    const expiryStatus = getExpiryStatus(item.expiryDate);
    
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-lg">{item.ingredient?.name || "Unknown ingredient"}</h3>
              <p className="text-sm text-gray-600">
                {item.quantity} {item.unit}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">{item.location}</span>
                {item.isFrozen && (
                  <Badge variant="secondary" className="text-xs">
                    Frozen
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              {item.expiryDate && (
                <div className="mb-2">
                  <Badge 
                    variant={expiryStatus.status === "expired" || expiryStatus.status === "critical" ? "destructive" : 
                           expiryStatus.status === "warning" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {expiryStatus.text}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Expires: {formatDate(item.expiryDate)}
                  </p>
                </div>
              )}
              <div className="flex gap-1">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">← Back to Dashboard</Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">My Inventory</h1>
            </div>
            <Button onClick={() => setShowAddItem(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold">{inventoryStats?.totalItems || 0}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📦</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {inventoryStats?.expiringSoon || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {inventoryStats?.expiringThisWeek || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fridge</p>
                  <p className="text-2xl font-bold text-green-600">
                    {inventoryStats?.byLocation?.fridge || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm">🧊</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expiring Items Alert */}
        {expiringItems && expiringItems.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Items Expiring Soon
              </CardTitle>
              <CardDescription className="text-orange-700">
                These items need to be used quickly to avoid waste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expiringItems.slice(0, 3).map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="font-medium">{item.ingredient?.name}</span>
                    <Badge variant="destructive" className="text-xs">
                      {getExpiryStatus(item.expiryDate).text}
                    </Badge>
                  </div>
                ))}
                {expiringItems.length > 3 && (
                  <p className="text-sm text-orange-600">
                    +{expiringItems.length - 3} more items expiring soon
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Tabs */}
        <Tabs defaultValue="fridge" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fridge">
              Fridge ({inventoryStats?.byLocation?.fridge || 0})
            </TabsTrigger>
            <TabsTrigger value="pantry">
              Pantry ({inventoryStats?.byLocation?.pantry || 0})
            </TabsTrigger>
            <TabsTrigger value="freezer">
              Freezer ({inventoryStats?.byLocation?.freezer || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fridge" className="mt-6">
            <div className="space-y-4">
              {fridgeItems && fridgeItems.length > 0 ? (
                fridgeItems.map((item) => (
                  <InventoryItem key={item._id} item={item} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 mb-4">No items in your fridge yet</p>
                    <Button onClick={() => setShowAddItem(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pantry" className="mt-6">
            <div className="space-y-4">
              {pantryItems && pantryItems.length > 0 ? (
                pantryItems.map((item) => (
                  <InventoryItem key={item._id} item={item} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 mb-4">No items in your pantry yet</p>
                    <Button onClick={() => setShowAddItem(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="freezer" className="mt-6">
            <div className="space-y-4">
              {freezerItems && freezerItems.length > 0 ? (
                freezerItems.map((item) => (
                  <InventoryItem key={item._id} item={item} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 mb-4">No items in your freezer yet</p>
                    <Button onClick={() => setShowAddItem(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <AddInventoryItem onClose={() => setShowAddItem(false)} />
      )}
    </div>
  );
}
