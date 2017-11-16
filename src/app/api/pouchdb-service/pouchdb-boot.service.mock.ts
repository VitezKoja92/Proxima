import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import * as PouchDBlib from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

import Configuration = PouchDB.Configuration;
import { IPouchDBCreateIndexResult, User, IPouchDBFindUsersResult, IPouchDBPutResult, IPouchDBAllDocsResult } from '../models/index';

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

    sync(remote: string, options: any): void { }

    put(item: any): Promise<IPouchDBPutResult> {
        return Promise.resolve({
            ok: true,
            id: item._id,
            rev: item._rev
        });
    }

    createIndex(): Promise<IPouchDBCreateIndexResult> {
        return Promise.resolve({
            result: 'result'
        });
    }

    find(query: any): Promise<IPouchDBFindUsersResult> {

        let temp = [];
        if (isNullOrUndefined(query.selector.password)) {
            temp = this.users.filter((user: User) => {
                return query.selector.username.$eq === user.username;
            });
        } else {
            temp = this.users.filter((user: User) => {
                return query.selector.username.$eq === user.username
                    && query.selector.password.$eq === user.password;
            });
        }
        return Promise.resolve({
            'docs': temp,
            'warning': 'warning'
        });
    }

    allDocs(): Promise<IPouchDBAllDocsResult> {
        const result: IPouchDBAllDocsResult = {
            offset: 0,
            total_rows: 0,
            rows: []
        };
        this.users.forEach((user) => {
            result.rows.push({
                id: 'rowid',
                key: 'key',
                value: {
                    rev: 'rev'
                },
                doc: {
                    '_id': user._id,
                    'username': user.username,
                    'password': user.password,
                    'name': user.name,
                    'surname': user.surname,
                    'email': user.email,
                    'phoneNr': user.phoneNr
                }
            });
        });

        return Promise.resolve(result);
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
