import { Component, OnInit } from '@angular/core';
import { User } from '../../../../api/models/index';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { UserAPIService } from '../../../../api/pouchdb-service/user-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private Router: Router,
    private UserAPIService: UserAPIService
  ) {}

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' : '';
  }

  addUser(e, username, password, name, surname, email, phoneNr) {
    const newUser = new User(username, password, name, surname, email, phoneNr);
    this.UserAPIService.addUser(newUser)
    .then((id: string): void => {
      console.log('New user added: ', id);
    }, (error: Error): void => {
      console.log('Error: ', error);
    });
  }

}
