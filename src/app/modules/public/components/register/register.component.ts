import { isNullOrUndefined } from 'util';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../../api/models/index';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { UserAPIService } from '../../../../api/pouchdb-service/user-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form: FormGroup;

  constructor(
    private Router: Router,
    private UserAPIService: UserAPIService,
    private FormBuilder: FormBuilder
  ) {
    this.form = this.FormBuilder.group({
      'username': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      'name': [null, Validators.required],
      'surname': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'phoneNr': [null]
    });
  }

  addUser(data: any) {
    const newUser = new User(data.username, data.password, data.name, data.surname, data.email, data.phoneNr);
    this.UserAPIService.addUser(newUser)
    .then((id: string): void => {
      // localStorage.setItem('currentUser', id);
      // login
    }, (error: Error): void => {
      console.log('Error: ', error);
    });
  }
}
