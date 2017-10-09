import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
// declare function require(a);
// const PouchDB = require('pouchdb');

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


@Injectable()
export class PouchDBService {

  private pouchdb: any;

  constructor() {

    this.pouchdb = new PouchDB(
      'ordinacija_proxima_platform', // name of the database
      {
        auto_compaction: true // save only most current revisions in storage (not all of them)
      }
    );

  }

  public addUser( username: string, password: string,
                  name: string, surname: string, email: string, phoneNr: string): Promise<string> {

    const promise  = this.pouchdb.put({
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
