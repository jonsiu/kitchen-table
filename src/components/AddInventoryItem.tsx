"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";

interface AddInventoryItemProps {
  onClose: () => void;
}

export default function AddInventoryItem({ onClose }: AddInventoryItemProps) {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState<"fridge" | "pantry" | "freezer">("fridge");
  const [expiryDate, setExpiryDate] = useState("");
  const [isFrozen, setIsFrozen] = useState(false);

  const addToInventory = useMutation(api.userInventory.addToInventory);
  const ingredients = useQuery(api.ingredients.searchIngredients, 
    searchTerm ? { searchTerm } : "skip"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedIngredient) return;

    try {
      await addToInventory({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName || undefined,
        imageUrl: user.imageUrl || undefined,
        ingredientId: selectedIngredient._id,
        quantity: parseFloat(quantity),
        unit: unit || selectedIngredient.unit,
        location,
        expiryDate: expiryDate ? new Date(expiryDate).getTime() : undefined,
        isFrozen,
      });
      
      // Reset form
      setSelectedIngredient(null);
      setQuantity("");
      setUnit("");
      setExpiryDate("");
      setIsFrozen(false);
      onClose();
    } catch (error) {
      console.error("Error adding item to inventory:", error);
    }
  };

  const filteredIngredients = ingredients?.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Add Item to Inventory</CardTitle>
              <CardDescription>
                Add a new ingredient to your inventory
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ingredient Search */}
            <div className="space-y-2">
              <Label htmlFor="ingredient-search">Search Ingredient</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="ingredient-search"
                  placeholder="Type to search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Search Results */}
              {searchTerm && filteredIngredients.length > 0 && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {filteredIngredients.slice(0, 10).map((ingredient) => (
                    <button
                      key={ingredient._id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                      onClick={() => {
                        setSelectedIngredient(ingredient);
                        setSearchTerm(ingredient.name);
                        setUnit(ingredient.unit);
                      }}
                    >
                      <div className="font-medium">{ingredient.name}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {ingredient.category}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Ingredient */}
            {selectedIngredient && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="font-medium text-green-800">
                  Selected: {selectedIngredient.name}
                </p>
                <p className="text-sm text-green-600 capitalize">
                  {selectedIngredient.category}
                </p>
              </div>
            )}

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  placeholder="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="kg, g, ml, piece"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Select value={location} onValueChange={(value: "fridge" | "pantry" | "freezer") => setLocation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fridge">🧊 Fridge</SelectItem>
                  <SelectItem value="pantry">🏠 Pantry</SelectItem>
                  <SelectItem value="freezer">❄️ Freezer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            {/* Frozen Checkbox */}
            {location === "freezer" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-frozen"
                  checked={isFrozen}
                  onChange={(e) => setIsFrozen(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="is-frozen">This item is frozen</Label>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={!selectedIngredient}>
                Add to Inventory
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
