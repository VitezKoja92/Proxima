import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { PouchDbBootService } from './pouchdb-boot.service';
import { IPouchDBPutResult, IPouchDBAllDocsResult, User, IPouchDBFindUsersResult } from './../models/index';
import { environment } from './../../../environments/environment';

@Injectable()
export class UserAPIService {

  private db;
  private dbName = 'users_proxima';

  constructor(protected PouchDbBootService: PouchDbBootService) {

    // Database creation
    this.db = this.PouchDbBootService.useDatabase(
      this.dbName,
      {
        auto_compaction: true,
        revs_limit: 2
      }
    );

    // Database synchronization
    this.db.sync(`${environment.couch_url}${this.dbName}`, {
      live: true,
      retry: true
    });

    this.createIndexes();
  }

  public createIndexes() {
    // Index creation
    return this.db.createIndex({
      index: {
        fields: ['username, password, name, surname, email, phoneNr']
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  public addUser(user: User): Observable<string> {
    return Observable.fromPromise(this.db.put(user)
      .then((result: IPouchDBPutResult): string => {
        return result.id;
      }));
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
        return result.docs.length ? result.docs[0] : null;
      }).catch((error) => {
        console.log('Error: ', error);
      });
  }

  public getAllUsers(): Observable<User[]> {
    return Observable.fromPromise(this.db.allDocs({
      include_docs: true,
      startkey: 'user:'
    }).then((result: IPouchDBAllDocsResult): User[] => {
      return result.rows.map((row: any): User => {
        return ({
          _id: row.doc._id,
          username: row.doc.username,
          password: row.doc.password,
          name: row.doc.name,
          surname: row.doc.surname,
          email: row.doc.email,
          phoneNr: row.doc.phoneNr
        });
      });
    }));
  }
}
