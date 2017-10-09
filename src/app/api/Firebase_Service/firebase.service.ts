import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';

@Injectable()
export class FirebaseService {

  // users: any[];
  // patients: any[];

  constructor(private db: AngularFireDatabase) { }

  getUsers() {
    return this.db.list('/users').valueChanges(); // .subscribe() needs to be called on the result
  }
  // createNewUser() {}
  // userExists() {}

  // getPatients() {}
  // createNewPatient() {}
  // editPatient(id) {}
  // deletePatient(id) {}

}
