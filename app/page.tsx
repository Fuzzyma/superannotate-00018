import AddRecipeButton from "@/components/add-recipe-button";
import RecipeList from "@/components/recipe-list";
import { SearchFilters } from "@/components/search-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Recipe Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your favorite recipes in one place
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 w-full sm:w-60">
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <SearchFilters />
            <AddRecipeButton />
          </div>
          <Suspense fallback={<LoadingState />}>
            <RecipeList showFavoritesOnly={false} />
          </Suspense>
        </TabsContent>
        <TabsContent value="favorites" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <SearchFilters />
            <AddRecipeButton />
          </div>
          <Suspense fallback={<LoadingState />}>
            <RecipeList showFavoritesOnly={true} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center h-40">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
