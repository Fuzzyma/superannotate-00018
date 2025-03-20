import { CATEGORIES, Category } from "@/context/recipe-context";
import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  ingredients: z
    .array(z.string().min(1, { message: "Can't be empty" }))
    .min(1, { message: "At least one ingredient is required" }),
  instructions: z
    .array(z.string().min(1, { message: "Can't be empty" }))
    .min(1, { message: "At least one instruction is required" }),
  category: z.enum(CATEGORIES),
  cookTime: z
    .number({ invalid_type_error: "Required" })
    .gt(0, { message: "Must be greater than 0" }),
  servings: z
    .number({ invalid_type_error: "Required" })
    .min(1, { message: "Must be at least 1" }),
  image: z
    .string()
    .url({ message: "Image must be a valid URL" })
    .or(z.literal(""))
    .optional(),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
export type Recipe = RecipeFormData & {
  id: string;
  isFavorite: boolean;
  updatedAt: number;
  createdAt: number;
};
