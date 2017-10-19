import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  constructor(private Router: Router) { }

  logout() {
    localStorage.removeItem('currentUser');
    this.Router.navigate(['login']);
  }
}
