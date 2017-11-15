import { Injectable } from '@angular/core';
import * as PouchDBlib from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

import Configuration = PouchDB.Configuration;
import { IPouchDBCreateIndexResult, User, IPouchDBFindUsersResult, IPouchDBPutResult } from '../models/index';

export class PouchDb {

    users = [
        {
            '_id': 'id1',
            'username': 'username1',
            'password': 'password1',
            'name': 'name1',
            'surname': 'surname1',
            'email': 'email1',
            'phoneNr': 'phoneNr1'
        },
        {
            '_id': 'id2',
            'username': 'username2',
            'password': 'password2',
            'name': 'name2',
            'surname': 'surname2',
            'email': 'email2',
            'phoneNr': 'phoneNr2'
        }
    ];

    sync(remote: string, options: any): void {}

    createIndex(): Promise<IPouchDBCreateIndexResult> {
        return Promise.resolve({
            result: 'result'
        });
    }

    put(item: any): Promise<IPouchDBPutResult> {
        return Promise.resolve({
            ok: true,
            id: item._id,
            rev: item._rev
        });
    }

    find(query: any): Promise<IPouchDBFindUsersResult> {
        return Promise.resolve({
            docs: this.users,
            warning: 'warning'
        });
    }

    allDocs(): Promise<User[]> {
        return Promise.resolve(this.users);
    }
}

@Injectable()
export class PouchDbBootServiceMock {

  lib: any;

  constructor() {
    this.lib = PouchDBlib;
    this.lib.default.plugin(PouchDBFind.default);
  }

  useDatabase(dbName: string, options: Configuration.DatabaseConfiguration): any {
    return new PouchDb();
  }
}
