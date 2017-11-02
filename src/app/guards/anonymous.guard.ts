import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AnonymousGuard implements CanActivate {

  constructor(private AuthenticationService: AuthenticationService,
    private Router: Router) {
}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.AuthenticationService.isSessionValid()) {
      // console.log('anonymous guard', 'true in guard');
      return true;
    } else {
      this.Router.navigate(['/login']);
    }
  }
}
