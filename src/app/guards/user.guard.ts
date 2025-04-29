import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const rol = localStorage.getItem('rol');
    if (rol === 'usuario') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
