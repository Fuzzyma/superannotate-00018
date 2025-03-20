"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRecipes } from "@/context/recipe-context";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/types/recipe";
import { Clock, Edit, Heart, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteRecipeDialog from "./delete-recipe-dialog";
import { RecipeModal } from "./recipe-modal";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard2({ recipe }: RecipeCardProps) {
  const { toggleFavorite } = useRecipes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full">
        <div className="aspect-video relative overflow-hidden">
          <Link href={`/recipes/${recipe.id}`} className="contents">
            <img
              src={recipe.image || `/placeholder.svg?height=200&width=300`}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={() => toggleFavorite(recipe.id)}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                recipe.isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              )}
            />
            <span className="sr-only">
              {recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
            </span>
          </Button>
        </div>

        <CardContent className="flex-1 pt-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">
              {recipe.title}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">{recipe.category}</Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {recipe.cookTime} mins
            </div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {recipe.description}
          </p>
        </CardContent>
      </Card>

      {isModalOpen && (
        <RecipeModal
          recipe={recipe}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="edit"
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteRecipeDialog
          recipe={recipe}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </>
  );
}
