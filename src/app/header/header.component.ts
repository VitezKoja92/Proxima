import { User } from './../api/models';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../api/authentication-service/Authentication.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser: User;

  constructor(private AuthenticationService: AuthenticationService,
              private Router: Router) { }

  ngOnInit() {  }

  logout() {
    localStorage.removeItem('currentUser');
    this.Router.navigate(['login']);
  }
}
