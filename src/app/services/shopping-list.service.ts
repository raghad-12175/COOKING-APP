import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ingredient } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  // ⭐ SIGNALS for state management
  private itemsSignal = signal<Ingredient[]>(this.loadFromStorage());
  private favoritesSignal = signal<number[]>(this.loadFavorites());

  // 🔓 Public readonly signals
  readonly items = this.itemsSignal.asReadonly();
  readonly favorites = this.favoritesSignal.asReadonly();

  // ⭐ Computed signals (derived state)
  readonly itemCount = computed(() => this.itemsSignal().length);
  readonly favoritesCount = computed(() => this.favoritesSignal().length);
  readonly isEmpty = computed(() => this.itemsSignal().length === 0);

  // 🔄 Also keep BehaviorSubject for backward compatibility
  private itemsSubject = new BehaviorSubject<Ingredient[]>(this.loadFromStorage());
  public items$: Observable<Ingredient[]> = this.itemsSubject.asObservable();

  addItems(ingredients: Ingredient[]): void {
    const newList = [...this.itemsSignal(), ...ingredients];
    this.itemsSignal.set(newList);
    this.itemsSubject.next(newList);
    this.saveToStorage(newList);
  }

  removeItem(item: Ingredient): void {
    const updated = this.itemsSignal().filter(i => i.id !== item.id);
    this.itemsSignal.set(updated);
    this.itemsSubject.next(updated);
    this.saveToStorage(updated);
  }

  clearList(): void {
    this.itemsSignal.set([]);
    this.itemsSubject.next([]);
    this.saveToStorage([]);
  }

  getItems(): Observable<Ingredient[]> {
    return this.items$;
  }

  // ⭐ Favorites with Signals
  toggleFavorite(recipeId: number): void {
    const current = this.favoritesSignal();
    const updated = current.includes(recipeId)
      ? current.filter(id => id !== recipeId)
      : [...current, recipeId];
    
    this.favoritesSignal.set(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  }

  isFavorite(recipeId: number): boolean {
    return this.favoritesSignal().includes(recipeId);
  }

  // 💾 Storage
  private saveToStorage(items: Ingredient[]): void {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }

  private loadFromStorage(): Ingredient[] {
    const data = localStorage.getItem('shoppingList');
    return data ? JSON.parse(data) : [];
  }

  private loadFavorites(): number[] {
    const data = localStorage.getItem('favorites');
    return data ? JSON.parse(data) : [];
  }
}