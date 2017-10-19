import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './../services/authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private AuthenticationService: AuthenticationService,
              private Router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.AuthenticationService.isSessionValid()) {
      console.log('true in guard');
      return true;
    } else {
      this.Router.navigate(['/login']);
    }
  }
}
