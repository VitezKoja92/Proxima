import { IPouchDBPutResult, IPouchDBAllDocsResult, User } from './../models/index';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

import { PouchDbBootService } from './pouchdb-boot.service';



@Injectable()
export class UserAPIService {

  private users_pouchdb;
  private dbName = 'users_proxima';

  constructor(protected PouchDbBootService: PouchDbBootService) {

    // Database creation
    this.users_pouchdb = this.PouchDbBootService.useDatabase(
      'users_proxima', // name of the database
      {
        auto_compaction: true // save only most current revisions in storage (not all of them)
      }
    );

    // Index creation

    // Database synchronization
    this.users_pouchdb.sync(`${environment.couch_url}${this.dbName}`, {
      live: true,
      retry: true
    }).on('change', function (change) {
      console.log('Something is changed: ', change);
    }).on('paused', function (info) {
      console.log('Paused: ', info);
    }).on('active', function (info) {
      console.log('Active(resumed): ', info);
    }).on('error', function (err) {
      console.log('Error: ', err);
    });

  }

  public addUser(user: User): Promise<string> {
    const promise = this.users_pouchdb.put(user)
      .then(
      (result: IPouchDBPutResult): string => {
        console.log('added with id: ' + result.id);
        return result.id;
      }
      );

    return promise;
  }

  public userExists(username: string, password: string): Promise<boolean> {
    const promise = this.users_pouchdb.allDocs({
      include_docs: true,
      startkey: 'user:',
      endKey: 'user:\uffff'
    }).then(
      (result: IPouchDBAllDocsResult): boolean => {
        const users = result.rows.map(
          (row: any): User => {
            return ({
              _id: row.doc._id,
              username: row.doc.username,
              password: row.doc.password,
              name: row.doc.name,
              surname: row.doc.surname,
              email: row.doc.email,
              phoneNr: row.doc.phoneNr
            });
          }
        );
        const filteredUsers = users.filter((u) => {
          return u.username === username && u.password === password;
        });
        return filteredUsers.length > 0 ? true : false;
      }
      );
    return promise;
  }

  public getUsers(): Promise<User[]> {
    const promise = this.users_pouchdb.allDocs({
      include_docs: true,
      startkey: 'user:',
      endKey: 'user:\uffff'
    }).then(
      (result: IPouchDBAllDocsResult): User[] => {
        return result.rows.map(
          (row: any): User => {
            return ({
              _id: row.doc._id,
              username: row.doc.username,
              password: row.doc.password,
              name: row.doc.name,
              surname: row.doc.surname,
              email: row.doc.email,
              phoneNr: row.doc.phoneNr
            });
          }
        );
      }
      );
    return promise;
  }
}
