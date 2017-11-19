import { IPouchDBRemoveResult, IPouchDBGetResult, Patient } from './../models/index';
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

    appointments = [
        {
            '_id': 'id1',
            '_rev': 'rev1',
            'user': null,
            'patient': null,
            'date': new Date(2013, 13, 1),
            'hour': 1,
            'minute': 1,
            'description': 'description1'
        },
        {
            '_id': 'id2',
            '_rev': 'rev2',
            'user': null,
            'patient': null,
            'date': new Date(2013, 13, 2),
            'hour': 2,
            'minute': 2,
            'description': 'description2'
        }
    ];

    patients = [
        {
          '_id': 'id1',
          '_rev': 'rev1',
          'personalInfo': {
            'name': 'name1',
            'surname': 'surname1',
            'dateOfBirth': new Date(2013, 13, 1),
            'address': {
              'country': 'country1',
              'city': 'city1',
              'postcode': 1,
              'street': 'street1',
              'streetNo': 'streetNo1'
            },
            'profession': 'profession1',
          },
          'medicalHistory': [
            {
              '_id': 'id1',
              'date': 'date1',
              'anamnesis': null,
              'diagnostics': null,
              'statusLocalis': 'statusLocalis1',
              'diagnosis': 'diagnosis1',
              'recommendedTherapy': null
            }
          ]
        },
        {
          '_id': 'id2',
          '_rev': 'rev2',
          'personalInfo': {
            'name': 'name2',
            'surname': 'surname2',
            'dateOfBirth': new Date(2013, 13, 2),
            'address': {
              'country': 'country2',
              'city': 'city2',
              'postcode': 2,
              'street': 'street2',
              'streetNo': 'streetNo2'
            },
            'profession': 'profession2',
          },
          'medicalHistory': [
            {
              '_id': 'id2',
              'date': 'date2',
              'anamnesis': null,
              'diagnostics': null,
              'statusLocalis': 'statusLocalis2',
              'diagnosis': 'diagnosis2',
              'recommendedTherapy': null
            }
          ]
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
        if (isNullOrUndefined(query.selector._id)) {
            if (isNullOrUndefined(query.selector.date)
            || isNullOrUndefined(query.selector.hour)
            || isNullOrUndefined(query.selector.minute)) {
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
            } else {
                temp = this.appointments.filter((appointment: Appointment) => {
                    return appointment.date.getMilliseconds() === query.selector.date.$eq.getMilliseconds()
                        && appointment.hour === query.selector.hour.$eq
                        && appointment.minute === query.selector.minute.$eq;
                });
            }
        } else {
            temp = this.patients.filter((patient: Patient) => {
                return patient._id === query.selector._id.$eq;
            });
        }
        return Promise.resolve({
            'docs': temp,
            'warning': 'warning'
        });
    }
    get(id: string): Promise<Appointment> {
        let myAppointment: Appointment;
        for (let appointment of this.appointments) {
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
