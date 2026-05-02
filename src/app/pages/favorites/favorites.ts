import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeGrid } from '../../components/recipe-grid/recipe-grid';
import { RecipeService } from '../../services/recipe';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Recipe } from '../../models/recipe.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RecipeGrid],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class Favorites implements OnInit {
  private recipeService = inject(RecipeService);
  private shoppingService = inject(ShoppingListService);

  recipes: Recipe[] = [];
  loading = false;

  // ⭐ Computed signal
  favoritesCount = computed(() => this.shoppingService.favorites().length);

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const favIds = this.shoppingService.favorites();
    
    if (favIds.length === 0) {
      this.recipes = [];
      return;
    }

    this.loading = true;

    // ⭐ Multiple concurrent API calls using forkJoin
    const requests = favIds.map(id =>
      this.recipeService.getRecipeDetails(id).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        this.recipes = results.filter(r => r !== null) as Recipe[];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}