import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../api/Classes/user';
import { AuthenticationService } from '../api/Authentication_Service/Authentication.service';
import { PouchDBService } from '../api/PouchDB_Service/pouchdb.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentUser: User;
  email = '';
  password = '';
  errorMessage = '';
  error: {name: string, message: string} = {name: '', message: ''};

  constructor(public authService: AuthenticationService, private router: Router, private pouch: PouchDBService) { }

  ngOnInit() {
  }

  addUser(e, username, password, name, surname, email, phoneNr) {
    this.pouch.addUser(username, password, name, surname, email, phoneNr)
    .then((id: string): void => {
      console.log( 'New user added: ', id );
    }, (error: Error): void => {
      console.log('Error: ', error);
    });


  }

}
