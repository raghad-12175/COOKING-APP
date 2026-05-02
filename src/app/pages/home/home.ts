import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from '../../components/search/search';
import { RecipeGrid } from '../../components/recipe-grid/recipe-grid';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Search, RecipeGrid],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  recipes: Recipe[] = [];
  loading = false;

  onResults(recipes: Recipe[]): void {
    this.recipes = recipes;
  }

  onLoading(state: boolean): void {
    this.loading = state;
  }
}