import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Recipe } from '../../models/recipe.model';
import { ShoppingListService } from '../../services/shopping-list.service';
import { RecipeDetails } from '../recipe-details/recipe-details';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.css']
})
export class RecipeCard {
  @Input() recipe!: Recipe;
  
  private dialog = inject(MatDialog);
  private shoppingService = inject(ShoppingListService);
  
  isFav = false;

  openDetails(): void {
    this.dialog.open(RecipeDetails, {
      width: '700px',
      maxHeight: '90vh',
      data: { recipeId: this.recipe.id }
    });
  }

  addtoFavourites(event: Event): void {
    event.stopPropagation();
    this.isFav = !this.isFav;
  }
}