import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { User } from '../../../../api/models/index';
import { UserAPIService } from '../../../../api/pouchdb-service/user-api.service';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  users: User[];
  form: FormGroup;

  constructor(public AuthenticationService: AuthenticationService,
    private Router: Router,
    private UserAPIService: UserAPIService,
    private FormBuilder: FormBuilder) {
    this.form = FormBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.UserAPIService.getAllUsers()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  login(data: any) {
    this.Router.navigate(['/dashboard']);
    // this.AuthenticationService.login(username, password)
    //   .then((response: boolean): void => {
    //    if (response) {
    //     this.Router.navigate(['/dashboard']);
    //    } else {
    //      alert('Wrong Username and/or Password!');
    //    }
    //   }).catch((error: Error) => {
    //     console.log('Error: ', error);
    //   });
  }
}
