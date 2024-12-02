import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cartItem';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, AsyncPipe, CommonModule],
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart$: Observable<CartItem[]>; // Observable для кошика
  cartItemCount$: Observable<number>; // Observable для кількості товарів

  constructor(private router: Router, private cartService: CartService) {
    this.cart$ = this.cartService.getCartItems(); // Отримання Observable з сервісу
    this.cartItemCount$ = this.cartService.getCartItemCount();
  }

  ngOnInit(): void {}

  // Оновлення кількості товару
  updateQuantity(cartItem: CartItem, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(cartItem.product.id, quantity);
    }
  }

  // Видалення товару з кошика
  removeFromCart(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem.product.id);
  }

  // Очищення кошика
  clearCart(): void {
    this.cartService.clearCart();
  }

  // Перехід до оформлення замовлення
  goToCheckout(): void {
    alert('Функція оплати ще не реалізована!');
  }

  // Перехід до головної сторінки
  goHome(): void {
    this.router.navigate(['']);
  }

  // Отримання загальної вартості кошика
  getTotalPrice(): number {
    return this.cartService.getTotalPrice(); // Використання сервісу для розрахунку
  }
}
