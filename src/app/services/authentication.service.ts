import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserAPIService } from './../api/pouchdb-service/user-api.service';
import { User } from './../api/models/index';

@Injectable()
export class AuthenticationService {

  private currentUser: User;

  constructor(private UserAPIService: UserAPIService) {}

  login(username: string, password: string): Promise<boolean> {
    return this.UserAPIService.getUser(username, password)
    .then((user: User): boolean => {
      if (!isNullOrUndefined(user)) {
        this.currentUser = user;
        // localStorage.setItem('currentUser', user._id);
        return true;
      }
      return false;
    });
  }

  logout(): void {
    this.currentUser = null;
    // localStorage.removeItem('currentUser');
  }

  isSessionValid(): boolean {
    return !isNullOrUndefined(this.currentUser) ;
  }

}
