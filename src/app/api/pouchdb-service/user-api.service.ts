import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

import { PouchDbBootService } from './pouchdb-boot.service';
import { IPouchDBPutResult, IPouchDBAllDocsResult, User, IPouchDBCreateIndexResult, IPouchDBFindUsersResult } from './../models/index';
import { environment } from './../../../environments/environment';

@Injectable()
export class UserAPIService {

  private db;
  private dbName = 'users_proxima';

  constructor(protected PouchDbBootService: PouchDbBootService) {

    // Database creation
    this.db = this.PouchDbBootService.useDatabase(
      'users_proxima',
      {
        auto_compaction: true, // save only most current revisions in storage (not all of them)
        revs_limit: 2
      }
    );

    // Database synchronization
    this.db.sync(`${environment.couch_url}${this.dbName}`, {
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

    // Index creation
    this.db.createIndex({
      index: {
        fields: ['username, password, name, surname, email, phoneNr']
      }
    }).then((result: IPouchDBCreateIndexResult) => {
      // handle result
    }).catch((err) => {
      console.log(err);
    });
    // this.getUser('b');
  }

  public addUser(user: User): Promise<string> {
    return this.db.put(user)
      .then(
      (result: IPouchDBPutResult): string => {
        return result.id;
      }
      );
  }

  public getUser(username: string, password?: string): Promise<User> | null {

    let userQuery;

    if (isNullOrUndefined(password)) {
      userQuery = {
        selector: {
          username: { $eq: username }
        }
      };
    } else {
      userQuery = {
        selector: {
          username: { $eq: username },
          password: { $eq: password }
        }
      };
    }
    return this.db.find(userQuery)
      .then((result: IPouchDBFindUsersResult): User | null => {
        console.log('Result: ', result);
        return result.docs.length ? result.docs[0] : null;
      }).catch((error: Error) => {
        console.log('Error: ', error);
      });
  }

  public getAllUsers(): Promise<User[]> {
    const promise = this.db.allDocs({
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
