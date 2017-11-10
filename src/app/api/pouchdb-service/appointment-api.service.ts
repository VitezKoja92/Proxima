import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { PouchDbBootService } from './pouchdb-boot.service';
import {
  Appointment,
  IPouchDBAllDocsResult,
  IPouchDBCreateIndexResult,
  IPouchDBPutResult,
  IPouchDBRemoveResult,
  User,
  Patient
} from './../models/index';

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
    });

    // Index creation
    this.db.createIndex({
      index: {
        fields: ['user._id, patient.name, patient.surname, date, hour, minute, description']
      }
    }).then((result: IPouchDBCreateIndexResult) => {
      // handle result
    }).catch((err) => {
      console.log(err);
    });
  }

  public getAppointment(date: Date, hour: number, minute: number): Promise<Appointment> {
    const query = {
      selector: {
        'date': { $eq: date },
        'hour': { $eq: hour },
        'minute': { $eq: minute }
      }
    };
    return this.db.find(query)
      .then((result): Appointment => {
        return result.docs.length ? result.docs[0] : null;
      }).catch((error: Error) => {
        console.log('Error: ', error);
      });
  }

  getAllAppointments(): Promise<Appointment[]> {
    const promise = this.db.allDocs({
      include_docs: true,
      startkey: 'appointment:'
    }).then((result: IPouchDBAllDocsResult): Appointment[] => {
      return result.rows.map((row: any): Appointment => {
        return ({
          _id: row.doc._id,
          _rev: row.doc._rev,
          user: row.doc.user,
          patient: row.doc.patient,
          date: new Date(row.doc.date),
          hour: row.doc.hour,
          minute: row.doc.minute,
          description: row.doc.description
        });
      });
    });
    return promise;
  }

  public addAppointment(appointment: Appointment): Promise<string> {
    return this.db.put(appointment)
      .then((result: IPouchDBPutResult): string => {
        return result.id;
      });
  }

  public deleteAppointment(id: string): Promise<IPouchDBRemoveResult> {
    return this.db.get(id)
      .then((doc: Appointment) => {
        return this.db.remove(doc);
      }).catch((error: Error) => {
        console.log('Error: ', error);
      });
  }

  public editAppointment(id: string, rev: string, date: Date, description: string,
    patient: Patient, doctor: User, hour: number, minute: number): Promise<Appointment> {
    return this.db.get(id)
      .then((doc: Appointment): IPouchDBRemoveResult => {
        return this.db.put({
          _id: id,
          _rev: rev,
          user: doctor,
          patient: patient,
          date: date,
          hour: hour,
          minute: minute,
          description: description
        });
      }).then((res: string): void => {
      }).catch((error: Error): void => {
        console.log('Error: ', error);
      });
  }

}
