import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Product } from '../models/product';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url: string = 'https://localhost:7081/api/APIproducts';
  private token: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Метод для отримання токену як Observable
  getToken(): Observable<string | null> {
    const token = sessionStorage.getItem('token');
    console.log(`getToken() token=${token}`);
    return of(token); // Повертаємо токен як Observable
  }

  // Метод для виконання запиту на продукти
  getProducts(): Observable<Product[]> {
    return this.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          // Якщо токен відсутній, можна викинути помилку або повернути порожній список
          throw new Error('Token not found');
        }
        this.token = token; // Зберігаємо токен
        return this.http.get<Product[]>(this.url, {
          headers: this.getHeaders(),
        });
      })
    );
  }

  // Метод для отримання заголовків з токеном
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  // Інші методи для взаємодії з продуктами
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, product, {
      headers: this.getHeaders(),
    });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product, {
      headers: this.getHeaders(),
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
