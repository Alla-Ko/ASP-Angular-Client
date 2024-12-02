import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth.guard.service'; // Guard для захисту
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // Головна сторінка
  { path: 'login', component: LoginComponent }, // Сторінка авторизації
  { path: 'register', component: RegisterComponent }, // Сторінка реєстрації
	{ path: 'cart', component: CartComponent }, // Сторінка кошика
];
