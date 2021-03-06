import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { environment } from '../../../environments/environment';
import { PouchDbBootService } from './pouchdb-boot.service';
import {
  Appointment,
  IPouchDBAllDocsResult,
  IPouchDBPutResult,
  IPouchDBRemoveResult,
  User,
  Patient,
  IPouchDBDocsResult
} from './../models/index';

@Injectable()
export class AppointmentAPIService {

  private db;
  private dbName = 'appointments_proxima';
  private dbChange$: Subject<any> = new Subject();

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

    const changes = this.db.changes({
      live: true,
      include_docs: true
    }).on('change', (change) => {
      this.dbChange$.next(change);
    });

    this.createIndexes();
  }

  // Index creation
  public createIndexes() {
    return this.db.createIndex({
      index: {
        fields: ['user._id, patient.name, patient.surname, date, description']
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  public todayAppointments(): Observable<Appointment[]> {
    return this.dbChange$.startWith({})
      .switchMap(() => this.fetchAppointmentsToday(),
      (outer, inner) => {
        return inner;
      });
  }

  fetchAppointmentsToday(): Observable<Appointment[]> {
    return Observable.fromPromise(this.db.allDocs({
      include_docs: true,
      startkey: 'appointment:'
    })).map((result: IPouchDBDocsResult<Appointment>) => {

      return result.rows.map((row: any): Appointment => {
        const newAppointemnt = new Appointment(row.doc.user, row.doc.patient,
          row.doc.dateTime, row.doc.description);
        newAppointemnt._id = row.doc._id;

        return newAppointemnt;
      }).filter((appointment: Appointment) => {
        const today = new Date();
        const date = new Date(appointment.dateTime);
        return date.getDate() === today.getDate()
          && date.getMonth() === today.getMonth()
          && date.getFullYear() === today.getFullYear();
      }).sort(this.dateSort);
    });
  }

  public getAppointment(date: Date): Observable<Appointment> {
    const query = {
      selector: {
        'dateTime': {
          $eq: date
        }
      }
    };
    return Observable.fromPromise(this.db.find(query)
      .then((result): Appointment => {
        return result.docs.length ? result.docs[0] : null;
      }));
  }

  public allAppointments(): Observable<Appointment[]> {
    return this.dbChange$.startWith({})
      .switchMap(() => this.fetchAllAppointments(),
    (outer, inner) => {
      return inner;
    });
  }

  public fetchAllAppointments(): Observable<Appointment[]> {
    return Observable.fromPromise(this.db.allDocs({
      include_docs: true,
      startkey: 'appointment:'
    }).then((result: IPouchDBAllDocsResult): Appointment[] => {
      return result.rows.map((row: any): Appointment => {
        return ({
          _id: row.doc._id,
          _rev: row.doc._rev,
          user: row.doc.user,
          patient: row.doc.patient,
          dateTime: new Date(row.doc.dateTime),
          description: row.doc.description
        });
      });
    }));
  }

  public addAppointment(appointment: Appointment): Observable<string> {
    return Observable.fromPromise(this.db.put(appointment)
      .then((result: IPouchDBPutResult): string => {
        return result.id;
      }));
  }

  public deleteAppointment(id: string): Observable<IPouchDBRemoveResult> {
    return Observable.fromPromise(this.db.get(id)
      .then((doc: Appointment) => {
        return this.db.remove(doc);
      }).catch((error: Error) => {
        console.log('Error: ', error);
      }));
  }

  public editAppointment(id: string, rev: string, date: Date, description: string,
    patient: Patient, doctor: User): Observable<Appointment> {
    return Observable.fromPromise(this.db.get(id)
      .then((doc: Appointment): IPouchDBRemoveResult => {
        return this.db.put({
          _id: id,
          _rev: rev,
          user: doctor,
          patient: patient,
          dateTime: date,
          description: description
        });
      }).catch((error: Error): void => {
        console.log('Error: ', error);
      }));
  }

  private dateSort(a: Appointment, b: Appointment) {
    if (a.dateTime < b.dateTime) {
      return -1;
    } else {
      return 1;
    }
  }
}
