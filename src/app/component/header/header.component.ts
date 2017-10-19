import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../api/models';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  currentUser: User;

  constructor(private Router: Router) { }

  logout() {
    localStorage.removeItem('currentUser');
    this.Router.navigate(['login']);
  }
}
