"use client";

import { useRouter } from "next/navigation";
import { useRecipes } from "@/context/recipe-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Recipe } from "@/types/recipe";

interface DeleteRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export default function DeleteRecipeDialog({
  isOpen,
  onClose,
  recipe,
}: DeleteRecipeDialogProps) {
  const router = useRouter();
  const { deleteRecipe } = useRecipes();

  const handleDelete = () => {
    deleteRecipe(recipe.id);
    onClose();
    router.push("/");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the recipe &quot;{recipe.title}&quot;.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
