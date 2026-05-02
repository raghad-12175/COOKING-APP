import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recipe, SearchResponse, Ingredient } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl: string = environment.mealDbUrl;
  private http: HttpClient = inject(HttpClient);

  // 🔍 Search by name
  searchRecipes(query: string): Observable<SearchResponse> {
    return this.http.get<any>(`${this.apiUrl}/search.php?s=${query}`).pipe(
      map(response => this.mapToSearchResponse(response.meals))
    );
  }

  // 🌟 Get recipe details
  getRecipeDetails(id: number): Observable<Recipe> {
    return this.http.get<any>(`${this.apiUrl}/lookup.php?i=${id}`).pipe(
      map(response => this.mapToRecipe(response.meals[0]))
    );
  }

  // ⭐ Multiple Concurrent API Calls (forkJoin)
  searchByMultipleIngredients(ingredients: string[]): Observable<Recipe[]> {
    const requests = ingredients.map(ing =>
      this.http.get<any>(`${this.apiUrl}/filter.php?i=${ing.trim()}`)
    );

    return forkJoin(requests).pipe(
      map((responses: any[]) => {
        const allMeals: any[] = [];
        const seenIds = new Set<string>();

        responses.forEach(response => {
          if (response.meals) {
            response.meals.forEach((meal: any) => {
              if (!seenIds.has(meal.idMeal)) {
                seenIds.add(meal.idMeal);
                allMeals.push(meal);
              }
            });
          }
        });

        return allMeals.map(meal => ({
          id: parseInt(meal.idMeal),
          title: meal.strMeal,
          image: meal.strMealThumb,
          readyInMinutes: 30,
          servings: 4
        }));
      })
    );
  }

  // 🎲 Get random recipes for initial load
  getRandomRecipes(count: number = 8): Observable<Recipe[]> {
    const requests = Array(count).fill(0).map(() =>
      this.http.get<any>(`${this.apiUrl}/random.php`)
    );

    return forkJoin(requests).pipe(
      map((responses: any[]) =>
        responses.map(response => this.mapToRecipe(response.meals[0]))
      )
    );
  }

  // 🛠️ Helpers
  private mapToRecipe(meal: any): Recipe {
    return {
      id: parseInt(meal.idMeal),
      title: meal.strMeal,
      image: meal.strMealThumb,
      readyInMinutes: 30,
      servings: 4,
      summary: meal.strInstructions,
      extendedIngredients: this.extractIngredients(meal)
    };
  }

  private mapToSearchResponse(meals: any[]): SearchResponse {
    const recipes: Recipe[] = (meals || []).map(meal => this.mapToRecipe(meal));
    return {
      results: recipes,
      offset: 0,
      number: recipes.length,
      totalResults: recipes.length
    };
  }

  private extractIngredients(meal: any): Ingredient[] {
    const ingredients: Ingredient[] = [];
    
    for (let i = 1; i <= 20; i++) {
      const name = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (name && name.trim()) {
        const measureParts = (measure || '').trim().split(' ');
        const amount = parseFloat(measureParts[0]) || 1;
        const unit = measureParts.slice(1).join(' ') || 'piece';
        
        ingredients.push({
          id: i,
          name: name.trim(),
          amount: amount,
          unit: unit,
          original: `${measure} ${name}`.trim()
        });
      }
    }
    
    return ingredients;
  }
}