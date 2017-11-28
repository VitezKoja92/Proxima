import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import * as PouchDBlib from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

import Configuration = PouchDB.Configuration;
import {
    IPouchDBCreateIndexResult,
    IPouchDBFindUsersResult,
    IPouchDBPutResult,
    IPouchDBAllDocsResult,
    IPouchDBRemoveResult,
    IPouchDBInfo
} from '../models/index';

export class Change {
    on(changeType, callback) {
        return {};
    }
}

export class PouchDb {

    public store: any[] = [];

    sync(remote: string, options: any): void { }

    put(item: any): Promise<IPouchDBPutResult> {
        this.store.push(item);
        return Promise.resolve({
            ok: true,
            id: item._id,
            rev: item._rev
        });
    }

    changes(options) {
        return new Change();
    }


    createIndex(): Promise<IPouchDBCreateIndexResult> {
        return Promise.resolve({
            result: 'result'
        });
    }

    find(query: any): Promise<IPouchDBFindUsersResult> {
        let temp = [];
        temp = this.store.filter((item) => {
            if (isNullOrUndefined(query.selector._id)) {
                if (isNullOrUndefined(query.selector.date)
                    || isNullOrUndefined(query.selector.hour)
                    || isNullOrUndefined(query.selector.minute)) {
                    if (isNullOrUndefined(query.selector.password)) {
                        return query.selector.username.$eq === item.username;
                    } else {
                        return query.selector.username.$eq === item.username
                            && query.selector.password.$eq === item.password;
                    }
                } else {
                    return item.dateTime.getMilliseconds() === query.selector.dateTime.$eq.getMilliseconds();
                }
            } else {
                return item._id === query.selector._id.$eq;
            }
        });
        return Promise.resolve({
            'docs': temp,
            'warning': 'warning'
        });
    }

    info(): Promise<IPouchDBInfo> {
        const info = {
            'db_name': 'name',
            'doc_count': this.store.length,
            'update_seq': 1
        };

        return Promise.resolve(info);
    }

    get(id: string): Promise<any> {
        let myItem: any;
        for (let item of this.store) {
            if (item._id === id) {
                myItem = item;
            }
        }
        return Promise.resolve(myItem);
    }

    remove(doc: any): Promise<IPouchDBRemoveResult> {
        return Promise.resolve({
            'ok': true,
            'id': doc._id,
            'rev': doc._rev
        });
    }

    allDocs(): Promise<IPouchDBAllDocsResult> {
        const result: IPouchDBAllDocsResult = {
            offset: 0,
            total_rows: 0,
            rows: []
        };
        console.log('this.store in allDocs', this.store);
        this.store.forEach((item) => {
            result.rows.push({
                id: 'rowid',
                key: 'key',
                value: {
                    rev: 'rev'
                },
                doc: item
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
