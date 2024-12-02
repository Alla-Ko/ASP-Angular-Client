import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products$: Observable<Product[]> = new Observable<Product[]>(); // Ініціалізуємо порожнім Observable
  product: Product = this.resetProduct();
  isEditMode: boolean = false;
  isAdmin: boolean = false;
  cartItemCount$: Observable<number>;

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.cartItemCount$ = this.cartService.getCartItemCount();
  }

  ngOnInit(): void {
    this.checkUserAuthorization();
  }

  // Додавання товару в кошик
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  // Перехід до кошика
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  // Перевірка авторизації користувача
  checkUserAuthorization(): void {
    const token = sessionStorage.getItem('token');
    console.log(`token=${token}`);
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.checkUserRole();
    this.loadProducts(); // Завантажуємо продукти лише після перевірки авторизації
  }

  // Завантажуємо продукти
  loadProducts(): void {
    this.products$ = this.productService.getProducts();
  }

  // Перевірка ролі користувача
  checkUserRole(): void {
    const role = sessionStorage.getItem('role');
    this.isAdmin = role === 'admin';
    console.log(`checkUserRole isAdmin=${this.isAdmin}`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Обробка форми для додавання/редагування продукту
  onSubmit(): void {
    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id, this.product).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Помилка при оновленні продукту:', error);
        },
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: () => {
          this.loadProducts();
          this.product = this.resetProduct(); // Скидаємо форму
        },
        error: (error) => {
          console.error('Помилка при додаванні продукту:', error);
        },
      });
    }
  }

  // Режим редагування продукту
  editProduct(product: Product): void {
    this.product = { ...product };
    this.isEditMode = true;
  }

  // Видалення продукту
  deleteProduct(id: number): void {
    const confirmed = window.confirm('Ви впевнені, що хочете видалити цей продукт?');
    if (confirmed) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Помилка при видаленні продукту:', error);
        },
      });
    }
  }

  // Скасування редагування
  cancelEdit(): void {
    this.product = this.resetProduct();
    this.isEditMode = false;
  }

  // Скидання продукту
  private resetProduct(): Product {
    return { id: 0, name: '', price: 0, description: '' };
  }
}
