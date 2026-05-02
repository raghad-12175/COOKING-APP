import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Ingredient } from '../../models/recipe.model';
import { UnitConversionPipe } from '../../pipes/unit-conversion.pipe';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, UnitConversionPipe],
  templateUrl: './shopping-list.html',
  styleUrls: ['./shopping-list.css']
})
export class ShoppingList implements OnInit {
  private shoppingService = inject(ShoppingListService);
  
  items$!: Observable<Ingredient[]>;
  isOpen = false;

  ngOnInit(): void {
    this.items$ = this.shoppingService.getItems();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  removeItem(item: Ingredient): void {
    this.shoppingService.removeItem(item);
  }

  clearList(): void {
    this.shoppingService.clearList();
  }
}