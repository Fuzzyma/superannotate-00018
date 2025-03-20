"use client"

import type { Recipe } from "@/types/recipe"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Heart, MoreHorizontal, Trash2, Edit } from "lucide-react"
import Image from "next/image"
import { useRecipes } from "@/context/recipe-context"
import { useState } from "react"
import { RecipeModal } from "./recipe-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { toggleFavorite, deleteRecipe } = useRecipes()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="relative">
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <Image
              src={recipe.image || "/placeholder.svg?height=300&width=400"}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm ${
              recipe.isFavorite ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={() => toggleFavorite(recipe.id)}
          >
            <Heart className={`h-5 w-5 ${recipe.isFavorite ? "fill-current" : ""}`} />
            <span className="sr-only">{recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
          </Button>
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="mb-2">
                {recipe.category}
              </Badge>
              <CardTitle>{recipe.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">{recipe.description}</CardDescription>
            </div>
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
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Clock className="mr-1 h-4 w-4" />
            <span>
              {totalTime} min ({recipe.prepTime} prep, {recipe.cookTime} cook) • {recipe.servings} servings
            </span>
          </div>

          <div className={isExpanded ? "" : "max-h-32 overflow-hidden relative"}>
            <h4 className="font-medium mb-1">Ingredients:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 mb-4">
              {recipe.ingredients.slice(0, isExpanded ? undefined : 3).map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
              {!isExpanded && recipe.ingredients.length > 3 && (
                <li className="list-none text-muted-foreground">+{recipe.ingredients.length - 3} more ingredients</li>
              )}
            </ul>

            {isExpanded && (
              <>
                <h4 className="font-medium mb-1">Instructions:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="pl-1">
                      <span className="ml-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        </CardFooter>
      </Card>

      {isModalOpen && (
        <RecipeModal recipe={recipe} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode="edit" />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the recipe "{recipe.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRecipe(recipe.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

