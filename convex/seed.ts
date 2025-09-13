import { mutation } from "./_generated/server";

export const seedIngredients = mutation({
  handler: async (ctx) => {
    const ingredients = [
      // Vegetables
      { name: "Carrots", category: "vegetables", unit: "kg" },
      { name: "Onions", category: "vegetables", unit: "kg" },
      { name: "Tomatoes", category: "vegetables", unit: "kg" },
      { name: "Potatoes", category: "vegetables", unit: "kg" },
      { name: "Bell Peppers", category: "vegetables", unit: "piece" },
      { name: "Broccoli", category: "vegetables", unit: "head" },
      { name: "Spinach", category: "vegetables", unit: "bunch" },
      { name: "Lettuce", category: "vegetables", unit: "head" },
      { name: "Cucumber", category: "vegetables", unit: "piece" },
      { name: "Zucchini", category: "vegetables", unit: "piece" },
      
      // Fruits
      { name: "Apples", category: "fruits", unit: "kg" },
      { name: "Bananas", category: "fruits", unit: "bunch" },
      { name: "Oranges", category: "fruits", unit: "kg" },
      { name: "Lemons", category: "fruits", unit: "piece" },
      { name: "Strawberries", category: "fruits", unit: "kg" },
      { name: "Blueberries", category: "fruits", unit: "kg" },
      { name: "Grapes", category: "fruits", unit: "kg" },
      { name: "Avocado", category: "fruits", unit: "piece" },
      
      // Meat & Protein
      { name: "Chicken Breast", category: "meat", unit: "kg" },
      { name: "Ground Beef", category: "meat", unit: "kg" },
      { name: "Salmon", category: "fish", unit: "kg" },
      { name: "Eggs", category: "dairy", unit: "dozen" },
      { name: "Tofu", category: "protein", unit: "kg" },
      { name: "Greek Yogurt", category: "dairy", unit: "kg" },
      { name: "Cheese", category: "dairy", unit: "kg" },
      { name: "Milk", category: "dairy", unit: "L" },
      
      // Pantry Staples
      { name: "Rice", category: "grains", unit: "kg" },
      { name: "Pasta", category: "grains", unit: "kg" },
      { name: "Bread", category: "grains", unit: "loaf" },
      { name: "Olive Oil", category: "pantry", unit: "L" },
      { name: "Salt", category: "pantry", unit: "kg" },
      { name: "Black Pepper", category: "pantry", unit: "g" },
      { name: "Garlic", category: "pantry", unit: "kg" },
      { name: "Ginger", category: "pantry", unit: "kg" },
      { name: "Flour", category: "pantry", unit: "kg" },
      { name: "Sugar", category: "pantry", unit: "kg" },
      
      // Herbs & Spices
      { name: "Basil", category: "herbs", unit: "bunch" },
      { name: "Parsley", category: "herbs", unit: "bunch" },
      { name: "Cilantro", category: "herbs", unit: "bunch" },
      { name: "Oregano", category: "herbs", unit: "bunch" },
      { name: "Thyme", category: "herbs", unit: "bunch" },
      { name: "Rosemary", category: "herbs", unit: "bunch" },
      
      // Canned & Preserved
      { name: "Canned Tomatoes", category: "canned", unit: "can" },
      { name: "Canned Beans", category: "canned", unit: "can" },
      { name: "Canned Corn", category: "canned", unit: "can" },
      { name: "Olives", category: "canned", unit: "jar" },
      { name: "Pickles", category: "canned", unit: "jar" },
    ];

    // Check if ingredients already exist
    const existingIngredients = await ctx.db.query("ingredients").collect();
    if (existingIngredients.length > 0) {
      console.log("Ingredients already seeded");
      return;
    }

    // Insert ingredients
    for (const ingredient of ingredients) {
      await ctx.db.insert("ingredients", {
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        createdAt: Date.now(),
      });
    }

    console.log(`Seeded ${ingredients.length} ingredients`);
  },
});
