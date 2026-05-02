import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RecipeService } from '../../services/recipe';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Recipe } from '../../models/recipe.model';
import { UnitConversionPipe } from '../../pipes/unit-conversion.pipe';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, UnitConversionPipe],
  templateUrl: './recipe-details.html',
  styleUrls: ['./recipe-details.css']
})
export class RecipeDetails implements OnInit {
  private recipeService = inject(RecipeService);
  private shoppingService = inject(ShoppingListService);
  
  recipe: Recipe | null = null;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<RecipeDetails>,
    @Inject(MAT_DIALOG_DATA) public data: { recipeId: number }
  ) {}

  ngOnInit(): void {
    this.recipeService.getRecipeDetails(this.data.recipeId).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  addIngredientsToList(): void {
    if (this.recipe?.extendedIngredients) {
      this.shoppingService.addItems(this.recipe.extendedIngredients);
      this.dialogRef.close();
    }
  }
}