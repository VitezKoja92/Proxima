import { User } from './../api/models/index';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../api/authentication-service/Authentication.service';
import { UserAPIService } from '../api/pouchdb-service/user-api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signUpOpened: boolean;
  users: User[];
  userExistss: boolean;

  constructor(public AuthenticationService: AuthenticationService,
    private Router: Router,
    private UserAPIService: UserAPIService) {
    this.signUpOpened = false;
   }

  ngOnInit() {
    this.getUsers();
    // this.userExists('dacaca', 'dacacar');
  }

  loginUser(username, password) {
    this.userExists(username, password);
    if (this.userExistss) {
      console.log('exists');
    } else {
      console.log('does not exist');
    }
  }

  userExists(username, password): void {
    this.UserAPIService.userExists(username, password)
      .then((exists: boolean): void => {
        this.userExistss = exists;
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  addUser(e, username, password, name, surname, email, phoneNr) {
    const newUser = new User(username, password, name, surname, email, phoneNr);
    this.UserAPIService.addUser(newUser)
    .then((id: string): void => {
      console.log( 'New user added: ', id );
    }, (error: Error): void => {
      console.log('Error: ', error);
    });
  }

  getUsers(): void {
    this.UserAPIService.getUsers()
      .then((users: User[]): void => {
        this.users = users;
        // console.log('Users from pouchDB: ', this.users);
        // return users;
      }, (error: Error): void => {
        console.log('Error: ', error);
    });
    console.log('this.users: ', this.users);
  }

}
