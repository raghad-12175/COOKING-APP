export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  summary?: string;
  extendedIngredients?: Ingredient[];
  isFavorite?: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original?: string;
  recipeTitle?: string;
}

export interface SearchResponse {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}
