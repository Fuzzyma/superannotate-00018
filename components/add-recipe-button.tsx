"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { RecipeModal } from "./recipe-modal"

export default function AddRecipeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Recipe
      </Button>

      <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode="add" />
    </>
  )
}

