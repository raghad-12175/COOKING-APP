import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter, catchError, map, tap } from 'rxjs/operators';
import { RecipeService } from '../../services/recipe';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit {
  private recipeService = inject(RecipeService);
  
  searchControl: FormControl = new FormControl('');
  searchResults$!: Observable<Recipe[]>;

  @Output() resultsFound = new EventEmitter<Recipe[]>();
  @Output() loading = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.OnSearch();
  }

  OnSearch(): void {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((query: any) => !!query && query.length > 2),
      tap(() => this.loading.emit(true)),
      switchMap((query: any) =>
        this.recipeService.searchRecipes(query).pipe(
          catchError(err => {
            console.error('Search error:', err);
            return of({ results: [], offset: 0, number: 0, totalResults: 0 });
          })
        )
      ),
      map(response => response.results),
      tap(results => {
        this.loading.emit(false);
        this.resultsFound.emit(results);
      })
    );

    this.searchResults$.subscribe();
  }
}