"use client";

import { recipeSchema, type Recipe, type RecipeFormData } from "@/types/recipe";
import { CATEGORIES, useRecipes } from "@/context/recipe-context";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

interface RecipeModalProps {
  recipe?: Recipe;
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
}

const defaultRecipe: RecipeFormData = {
  title: "",
  description: "",
  ingredients: [""],
  instructions: [""],
  category: "Breakfast",
  prepTime: 0,
  cookTime: 0,
  servings: 1,
  image: "/placeholder.svg?height=300&width=400",
};

export function RecipeModal({
  recipe,
  isOpen,
  onClose,
  mode,
}: RecipeModalProps) {
  const {
    addRecipe,
    updateRecipe,
    categories: existingCategories,
  } = useRecipes();

  const [ingredients, setIngredients] = useState<string[]>(
    recipe?.ingredients || [""]
  );

  const [instructions, setInstructions] = useState<string[]>(
    recipe?.instructions || [""]
  );

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues:
      mode === "edit" && recipe
        ? {
            title: recipe.title,
            description: recipe.description,
            category: recipe.category,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            image: recipe.image,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
          }
        : defaultRecipe,
  });

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length > 1) {
      const newInstructions = [...instructions];
      newInstructions.splice(index, 1);
      setInstructions(newInstructions);
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const onSubmit = (data: RecipeFormData) => {
    // Include the current ingredients and instructions arrays
    const recipeData = {
      ...data,
      ingredients,
      instructions,
    };

    if (mode === "add") {
      addRecipe(recipeData);
    } else if (mode === "edit" && recipe) {
      updateRecipe({
        ...recipe,
        ...recipeData,
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-9/10 sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Recipe" : "Edit Recipe"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the details to add a new recipe to your collection."
              : "Update the details of your recipe."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter recipe title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the recipe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="prepTime"
                    rules={{
                      required: "Required",
                      min: { value: 0, message: "Must be positive" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prep Time (min)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cookTime"
                    rules={{
                      required: "Required",
                      min: { value: 0, message: "Must be positive" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cook Time (min)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="servings"
                    rules={{
                      required: "Required",
                      min: { value: 1, message: "Min 1 serving" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Servings</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="URL to recipe image" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use a placeholder image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel htmlFor="ingredients" className="block mb-2">
                    Ingredients
                  </FormLabel>
                  <div className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          id={
                            index === 0 ? "ingredients" : `ingredient-${index}`
                          }
                          value={ingredient}
                          onChange={(e) =>
                            handleIngredientChange(index, e.target.value)
                          }
                          placeholder={`Ingredient ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveIngredient(index)}
                          disabled={ingredients.length <= 1}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddIngredient}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ingredient
                  </Button>
                </div>

                <div>
                  <FormLabel htmlFor="instructions" className="block mb-2">
                    Instructions
                  </FormLabel>
                  <div className="space-y-2">
                    {instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="mt-2 mr-1 text-sm text-muted-foreground">
                          {index + 1}.
                        </div>
                        <Textarea
                          id={
                            index === 0
                              ? "instructions"
                              : `instruction-${index}`
                          }
                          value={instruction}
                          onChange={(e) =>
                            handleInstructionChange(index, e.target.value)
                          }
                          placeholder={`Step ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveInstruction(index)}
                          disabled={instructions.length <= 1}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddInstruction}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Add Recipe" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
