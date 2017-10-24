import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './../../../../services/authentication.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  constructor(private Router: Router, private AuthenticationService: AuthenticationService) { }

  logout() {
    this.AuthenticationService.logout();
    this.Router.navigate(['login']);
  }
}
