import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated =
      sessionStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      // Якщо користувач не авторизований, перенаправляємо на сторінку входу
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
