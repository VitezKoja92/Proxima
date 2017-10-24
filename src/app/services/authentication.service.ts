
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserAPIService } from './../api/pouchdb-service/user-api.service';
import { User } from './../api/models/index';

import { isNullOrUndefined } from 'util';

@Injectable()
export class AuthenticationService {

  private currentUser: User;

  constructor(private UserAPIService: UserAPIService) {}

  login(username: string, password: string): Promise<boolean> {
    return this.UserAPIService.getUser(username, password)
    .then((user: User): boolean => {
      console.log('user: ', user);
      if (!isNullOrUndefined(user)) {
        this.currentUser = user;
        return true;
      }
      return false;
    });
  }

  logout(): void {
    this.currentUser = null;
  }

  isSessionValid(): boolean {
    return !isNullOrUndefined(this.currentUser) ;
  }

}
