"use client";

import { useRecipes } from "@/context/recipe-context";
import { useEffect, useState } from "react";
import type { Recipe } from "@/types/recipe";
import RecipeCard2 from "./recipe-card2";

interface RecipeListProps {
  showFavoritesOnly: boolean;
}

export default function RecipeList({ showFavoritesOnly }: RecipeListProps) {
  const { recipes, searchTerm, selectedCategory } = useRecipes();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    let result = [...recipes];

    // Filter by favorites if needed
    if (showFavoritesOnly) {
      result = result.filter((recipe) => recipe.isFavorite);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description.toLowerCase().includes(term) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(term)
          )
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((recipe) => recipe.category === selectedCategory);
    }

    // Sort by most recently updated
    result.sort((a, b) => b.updatedAt - a.updatedAt);

    setFilteredRecipes(result);
  }, [recipes, searchTerm, selectedCategory, showFavoritesOnly]);

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No recipes found.</p>
        {showFavoritesOnly && (
          <p className="mt-2">Try adding some recipes to your favorites!</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredRecipes.map((recipe) => (
        <RecipeCard2 key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
