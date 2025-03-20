import { CATEGORIES, Category } from "@/context/recipe-context";
import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  category: z.enum(CATEGORIES),
  prepTime: z.number(),
  cookTime: z.number(),
  servings: z.number(),
  image: z.string().optional(),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
export type Recipe = RecipeFormData & {
  id: string;
  isFavorite: boolean;
  updatedAt: number;
  createdAt: number;
};
