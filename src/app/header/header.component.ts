import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../api/Authentication_Service/Authentication.service';
import { User } from '../api/Classes/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser: User;

  constructor(private authentication: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    // this.currentUser = this.authentication.getCurrentUser();
  }

  // showLogOut(): boolean {
  //   return this.authentication.getUserLoggedIn();
  // }

  logout() {
    localStorage.removeItem('currentUser');
    // this.authentication.setUserLoggedIn(false);
    this.router.navigate(['login']);
  }
}
