import { Sort } from '@angular/material';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Subject } from 'rxjs/Subject';

import { environment } from '../../../environments/environment';
import { PouchDbBootService } from './pouchdb-boot.service';
import {
  Appointment,
  IPouchDBAllDocsResult,
  IPouchDBCreateIndexResult,
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
        fields: ['user._id, patient.name, patient.surname, date, hour, minute, description']
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  public todayAppointments(): Observable<Appointment[]> {
    return this.dbChange$.startWith({})
    .switchMap(
      () => this.fetchAppointmentsToday(),
      (outer, inner) => {
        return inner;
      });
  }

  public getAppointment(date: Date, hour: number, minute: number): Promise<Appointment> {
    const query = {
      selector: {
        'date': {
          $eq: date
        },
        'hour': {
          $eq: hour
        },
        'minute': {
          $eq: minute
        }
      }
    };
    return this.db.find(query)
      .then((result): Appointment => {
        return result.docs.length ? result.docs[0] : null;
      }).catch((error: Error) => {
        console.log('Error: ', error);
      });
  }

   /**
   * sync:        --o1-o1--o2--o2--o3--o4-->
   * event:       e-e-----------e-----e---->
   * thr(event):  -----e----------e------e->
   * lastFrom():  -----o1---------o2-----o4>
   */

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

  fetchAppointmentsToday(): Observable<Appointment[]> {
    return Observable.fromPromise(this.db.allDocs({
      include_docs: true,
      startkey: 'appointment:'
    })).map((result: IPouchDBDocsResult<Appointment>) => {

      return result.rows.map((row: any): Appointment => {
        const newAppointemnt = new Appointment(row.doc.user, row.doc.patient,
          row.doc.date, row.doc.hour, row.doc.minute, row.doc.description);
        newAppointemnt._id = row.doc._id;

        return newAppointemnt;
      }).filter((appointment: Appointment) => {
        const today = new Date();
        const date = new Date(appointment.date);
        return date.getDate() === today.getDate()
          && date.getMonth() === today.getMonth()
          && date.getFullYear() === today.getFullYear();
      }).sort(this.dateSort);
    });
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
      }).catch((error: Error): void => {
        console.log('Error: ', error);
      });
  }

  private dateSort(a: Appointment, b: Appointment) {
    if (a.hour < b.hour) {
      return -1;
    } else if (a.hour === b.hour) {
      if (a.minute <= b.minute) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  }

}
