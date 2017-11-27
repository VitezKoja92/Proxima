import { IPouchDBRemoveResult, IPouchDBGetResult, Patient, IPouchDBInfo } from './../models/index';
import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import * as PouchDBlib from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

import Configuration = PouchDB.Configuration;
import {
    IPouchDBCreateIndexResult,
    User,
    IPouchDBFindUsersResult,
    IPouchDBPutResult,
    IPouchDBAllDocsResult,
    Appointment
} from '../models/index';

export class PouchDb {

    store: any[] = [];

    sync(remote: string, options: any): void { }

    put(item: any): Promise<IPouchDBPutResult> {
        this.store.push(item);
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
                    return item.date.getMilliseconds() === query.selector.date.$eq.getMilliseconds()
                    && item.hour === query.selector.hour.$eq
                    && item.minute === query.selector.minute.$eq;
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
        const info =  {
            'db_name': 'name',
            'doc_count': this.store.length,
            'update_seq': 1
        };

        return Promise.resolve(info);
    }

    get(id: string): Promise<Appointment> {
        let myAppointment: Appointment;
        for (let appointment of this.store) {
            if (appointment._id === id) {
                myAppointment = {
                    '_id': appointment._id,
                    '_rev': appointment._rev,
                    'user': appointment.user,
                    'patient': appointment.patient,
                    'date': appointment.date,
                    'hour': appointment.hour,
                    'minute': appointment.minute,
                    'description': appointment.description
                };
            }
        }
        console.log('myAppointment in get', myAppointment);
        return Promise.resolve(myAppointment);
    }

    remove(doc: any): Promise<IPouchDBRemoveResult> {
        console.log('doc in remove', doc);
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
                doc: {
                    '_id': item._id,
                    'username': item.username,
                    'password': item.password,
                    'name': item.name,
                    'surname': item.surname,
                    'email': item.email,
                    'phoneNr': item.phoneNr
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
