"use client";

import { recipeSchema, type Recipe, type RecipeFormData } from "@/types/recipe";
import { CATEGORIES, useRecipes } from "@/context/recipe-context";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
  cookTime: 0,
  servings: 1,
  image: "",
};

export function RecipeModal({
  recipe,
  isOpen,
  onClose,
  mode,
}: RecipeModalProps) {
  const { addRecipe, updateRecipe } = useRecipes();

  // const [ingredients, setIngredients] = useState<string[]>(
  //   recipe?.ingredients || [""]
  // );

  // const [instructions, setInstructions] = useState<string[]>(
  //   recipe?.instructions || [""]
  // );

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues:
      mode === "edit" && recipe
        ? {
            title: recipe.title,
            description: recipe.description,
            category: recipe.category,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            image: recipe.image,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
          }
        : async () => defaultRecipe,
  });

  const {
    fields: ingredients,
    append: handleAddIngredient,
    remove: handleRemoveIngredient,
  } = useFieldArray({
    name: "ingredients" as never,
    control: form.control,
  });

  const {
    fields: instructions,
    append: handleAddInstruction,
    remove: handleRemoveInstruction,
  } = useFieldArray({
    name: "instructions" as never,
    control: form.control,
  });

  const onSubmit = (data: RecipeFormData) => {
    if (mode === "add") {
      addRecipe(data);
    } else if (mode === "edit" && recipe) {
      updateRecipe({
        ...recipe,
        ...data,
      });
    }

    form.reset();

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

                <div className="grid grid-cols-2 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="cookTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cook Time (min)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            min={0}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || ""
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Servings</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            min={1}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || ""
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
                    {ingredients.map((field, index) => (
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}`}
                        key={field.id}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  {...field}
                                  placeholder={`Ingredient ${index + 1}`}
                                />
                                {ingredients.length <= 1 || (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveIngredient(index)
                                    }
                                    disabled={ingredients.length <= 1}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {form.formState.errors.ingredients?.root && (
                    <p
                      data-slot="form-message"
                      className={"text-destructive text-sm"}
                    >
                      {form.formState.errors.ingredients?.root.message}
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddIngredient("")}
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
                    {instructions.map((field, index) => (
                      <FormField
                        control={form.control}
                        name={`instructions.${index}`}
                        key={field.id}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Textarea
                                  {...field}
                                  placeholder={`Instruction ${index + 1}`}
                                />
                                {instructions.length <= 1 || (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveInstruction(index)
                                    }
                                    disabled={instructions.length <= 1}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {form.formState.errors.instructions?.root && (
                    <p
                      data-slot="form-message"
                      className={"text-destructive text-sm"}
                    >
                      {form.formState.errors.instructions?.root.message}
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddInstruction("")}
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
