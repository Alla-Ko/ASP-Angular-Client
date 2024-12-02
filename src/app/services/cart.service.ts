import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cartItem';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = this.loadCartFromSession(); // Завантажуємо кошик з sessionStorage або порожній масив
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  private cartItemCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.calculateCartItemCount()); // Ініціалізація кількості товарів

  constructor() {
    // Якщо кошик вже є в sessionStorage, оновлюємо кількість товарів
    this.cartItemCountSubject.next(this.calculateCartItemCount());
  }

  // Завантаження кошика з sessionStorage
  loadCartFromSession(): CartItem[] {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
    return [];
  }

  // Збереження кошика в sessionStorage
  saveCartToSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Отримати всі товари в кошику
  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  // Додати товар до кошика
  addToCart(product: Product): void {
    const existingCartItem = this.cartItems.find(
      (item) => item.product.id === product.id
    );
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.saveCartToSession(); // Оновлюємо кошик в sessionStorage
    this.cartItemsSubject.next(this.cartItems);
    this.cartItemCountSubject.next(this.calculateCartItemCount()); // Оновлюємо кількість товарів
  }

  // Змінити кількість товару в кошику
  updateQuantity(productId: number, quantity: number): void {
    const cardItem = this.cartItems.find(
      (item) => item.product.id === productId
    );
    if (cardItem) {
      cardItem.quantity = quantity;
      this.saveCartToSession(); // Оновлюємо кошик в sessionStorage
      this.cartItemsSubject.next(this.cartItems);
      this.cartItemCountSubject.next(this.calculateCartItemCount()); // Оновлюємо кількість товарів
    }
  }

  // Видалити товар з кошика
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(
      (item) => item.product.id !== productId
    );
    this.saveCartToSession(); // Оновлюємо кошик в sessionStorage
    this.cartItemsSubject.next(this.cartItems);
    this.cartItemCountSubject.next(this.calculateCartItemCount()); // Оновлюємо кількість товарів
  }

  // Очистити кошик
  clearCart(): void {
    this.cartItems = [];
    this.saveCartToSession(); // Оновлюємо кошик в sessionStorage
    this.cartItemsSubject.next(this.cartItems);
    this.cartItemCountSubject.next(this.calculateCartItemCount()); // Оновлюємо кількість товарів
  }

  // Отримати загальну вартість
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  // Отримати кількість товарів в кошику
  getCartItemCount(): Observable<number> {
    return this.cartItemCountSubject.asObservable(); // Повертаємо Observable для кількості товарів
  }

  // Обчислення кількості товарів у кошику
  private calculateCartItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}
