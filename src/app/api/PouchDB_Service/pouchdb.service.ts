import { Injectable } from '@angular/core';

import { PouchDbBootService } from './pouchdb-boot.service';

/* Helper INTERFACES */

export interface IUser {
  id: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  phoneNr: string;
}

interface IPouchDBAllDocsResult {
  offset: number;
  total_rows: number;
  rows: IPouchDBRow[];
}

/* results - begin */
interface IPouchDBGetResult {
  _id: string;
  _rev: string;
}

interface IPouchDBGetUserResult extends IPouchDBGetResult {
  name: string;
}

interface IPouchDBPutResult {
  ok: boolean;
  id: string;
  rev: string;
}

interface IPouchDBRemoveResult {
  ok: boolean;
  id: string;
  rev: string;
}

/* results - end */


interface IPouchDBRow {
  id: string;
  key: string;
  value: { rev: string };
  doc?: any;
}


/**
 * Use Pouch DB like TABLE in normal SQL.
 * It is normal for Company to have 1000+ (IBM has 100.000+) NoSql dbs
 * Making Db object as flat as possible is making your life easyer later on when it comes to NoSQL architecture
 * You can have many services that will rely on PouchDb and only difference would be actual database name
 *    e.g:
 *      UserService{this.PouchDbBootService.useDatebase('users'), findUser().....}
 *      CompanyService{this.PouchDbBootService.useDatebase('companies'), addCompany().....}
 *      CompanyClient{this.PouchDbBootService.useDatebase('clients'), getNewClients().....}
 * ...
 */

@Injectable()
export class PouchDBService {

  private pouchdb;

  constructor(protected PouchDbBootService: PouchDbBootService) {

    this.pouchdb = this.PouchDbBootService.useDatabase(
      'ordinacija_proxima_platform', // name of the database
      {
        auto_compaction: true // save only most current revisions in storage (not all of them)
      }
    );

  }

  /**
   *  How about you make class out of this :)
   *  export class User {
   *
   *  _id: string;
   *  username: username,
   *  password: password,
   *  ...
   *
   *  constructor(username, passsword, name...){
   *    this._id = 'user:' + new Date().getTime(),
   *    this.username = username;
   *    ...
   *    }
   *  }
   */
  public addUser(username: string, password: string,
                 name: string, surname: string, email: string, phoneNr: string): Promise<string> {

    // couchDB already has users/roles db integrated, maybe you wanna use that one?
    const promise = this.pouchdb.put({
      _id: 'user:' + new Date().getTime(),
      username: username,
      password: password,
      name: name,
      surname: surname,
      email: email,
      phoneNr: phoneNr
    }).then(
      (result: IPouchDBPutResult): string => {
        return result.id;
      }
    );

    return promise;
  }
}
