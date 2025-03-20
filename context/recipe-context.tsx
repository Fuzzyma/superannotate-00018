"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { Recipe } from "@/types/recipe";
import { sampleRecipes } from "@/lib/sample-recipes";

type RecipeContextType = {
  recipes: Recipe[];
  searchTerm: string;
  selectedCategory: string;
  addRecipe: (
    recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt" | "isFavorite">
  ) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  categories: Category[];
};

export const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Appetizer",
  "Italian",
  "Mexican",
  "Asian",
  "American",
  "Indian",
  "Mediterranean",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize recipes from localStorage or use sample recipes
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const storedRecipes = localStorage.getItem("recipes");
      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      } else {
        setRecipes(sampleRecipes);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }
  }, [recipes, isInitialized]);

  // Extract unique categories from recipes
  const categories = Array.from(
    new Set(recipes.map((recipe) => recipe.category))
  ).sort();

  // Add a new recipe
  const addRecipe = (
    recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt" | "isFavorite">
  ) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setRecipes((prev) => [...prev, newRecipe]);
  };

  // Update an existing recipe
  const updateRecipe = (updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === updatedRecipe.id
          ? { ...updatedRecipe, updatedAt: Date.now() }
          : recipe
      )
    );
  };

  // Delete a recipe
  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        searchTerm,
        selectedCategory,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite,
        setSearchTerm,
        setSelectedCategory,
        categories,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
}
