"use client";

import { useParams, useRouter } from "next/navigation";
import { useRecipes } from "@/context/recipe-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Edit, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { RecipeModal } from "@/components/recipe-modal";
import DeleteRecipeDialog from "@/components/delete-recipe-dialog";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { recipes } = useRecipes();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const id = typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to recipes
      </Button>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>{recipe.category}</Badge>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <Clock className="h-4 w-4 mr-1 " />
                      {recipe.cookTime} mins
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit recipe</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete recipe</span>
                  </Button>
                </div>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-6">
                <img
                  src={recipe.image || `/placeholder.svg?height=400&width=600`}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 ">
                <div className="col-span-2">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <ol className="space-y-4 list-decimal list-inside">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="pl-2">
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <Card className="self-start">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div></div>
      </div>

      <DeleteRecipeDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        recipe={recipe}
      />

      <RecipeModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        recipe={recipe}
        mode="edit"
      />
    </div>
  );
}
