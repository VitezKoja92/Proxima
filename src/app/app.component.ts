import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';
import { FirebaseService } from './api/Firebase_Service/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  users: any[];
  constructor(private firebase: FirebaseService) {
    // firebase.getUsers().subscribe(users => {
    //   this.users = users;
    // });
  }
}
