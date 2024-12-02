import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = 'https://localhost:7081/api/APIAuth/login';
  private registerUrl = 'https://localhost:7081/api/apiauth/register';

  private isLoggedIn = false; // Стан авторизації

  constructor(private http: HttpClient) {}

  // Метод для авторизації
  login(user: User): Observable<any> {
    return this.http.post(this.url, user);
  }

  // Метод для реєстрації
  register(user: User): Observable<any> {
    return this.http.post(this.registerUrl, user);
  }

  // Логіка для збереження стану авторизації
  handleAuthResponse(response: any): void {
    if (response.token) {
      // Якщо є токен, зберігаємо його
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('isAuthenticated', 'true');
      console.log(`response.isAdmin=${response.isAdmin}`);
      if (response.isAdmin||response.isAdmin == 'true') {
        sessionStorage.setItem('role', 'admin');
      }
    } else {
      sessionStorage.setItem('isAuthenticated', 'false');
    }
    this.isLoggedIn = true;
  }

  // Метод для виходу з системи
  logout(): void {
    this.isLoggedIn = false;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.setItem('isAuthenticated', 'false');
  }

  // Перевірка на авторизацію
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
