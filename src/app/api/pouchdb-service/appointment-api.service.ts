import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { PouchDbBootService } from './pouchdb-boot.service';
import { Appointment, IPouchDBAllDocsResult, IPouchDBCreateIndexResult, IPouchDBPutResult } from './../models/index';

@Injectable()
export class AppointmentAPIService {

  private db;
  private dbName = 'appointments_proxima';

  constructor(private PouchDbBootService: PouchDbBootService) {
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
        fields: [ 'user._id, patient.name, patient.surname, date, hour, minute, description' ]
      }
    }).then((result: IPouchDBCreateIndexResult) => {
      // handle result
    }).catch((err) => {
      console.log(err);
    });
  }

  getAllAppointments(): Promise<Appointment[]> {
    const promise = this.db.allDocs({
      include_docs: true,
      startkey: 'appointment:',
      endKey: 'appointment:\uffff'
    }).then(
      (result: IPouchDBAllDocsResult): Appointment[] => {
        return result.rows.map(
          (row: any): Appointment => {
            return ({
              _id: row.doc._id,
              user: row.doc.user,
              patient: row.doc.patient,
              date: new Date(row.doc.date),
              hour: row.doc.hour,
              minute: row.doc.minute,
              description: row.doc.description
            });
          }
        );
      }
    );

    return promise;
  }

  public addAppointment(appointment: Appointment): Promise<string> {
    return this.db.put(appointment)
      .then(
        (result: IPouchDBPutResult): string => {
          return result.id;
        }
      );
  }

}
