import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth.service'; // Сервіс для авторизації

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // Для повідомлення про помилку

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const user = { email: this.username, password: this.password };

    // Викликаємо метод для авторизації в сервісі
    this.authService.login(user).subscribe({
      next: (response: any) => {
        // Обробка відповіді і збереження даних про авторизацію
        this.authService.handleAuthResponse(response);

        // Перенаправлення на головну сторінку після успішної авторизації
        this.router.navigate(['']);
      },
      error: () => {
        // Якщо сталася помилка
        this.errorMessage = 'Неправильний логін або пароль';
      },
    });
  }
}

//const user = { email: 'alla@aa', password: 'alla12345' };