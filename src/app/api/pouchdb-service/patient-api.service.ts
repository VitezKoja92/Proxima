import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { PouchDbBootService } from './pouchdb-boot.service';
import { environment } from './../../../environments/environment';
import { IPouchDBCreateIndexResult, IPouchDBDocsResult } from '../models/index';
import {
  Patient,
  IPouchDBAllDocsResult,
  IPouchDBPutResult,
  IPouchDBFindPatientsResult,
  Address,
  IPouchDBRemoveResult,
  PatientPersonalInfo,
  MedicalHistoryItem
} from './../models/index';

@Injectable()
export class PatientAPIService {

  private db;
  private dbName = 'patients_proxima';
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

  public createIndexes() {
    return this.db.createIndex({
      index: {
        fields: ['personalInfo.name, personalInfo.surname, personalInfo.dateOfBirth,' +
          'address.country, address.city, address.street, address.streetNo, profession']
      }
    }).then((result: IPouchDBCreateIndexResult) => {
    }).catch((err) => {
      console.log(err);
    });
  }

  public addPatient(patient: Patient): Observable<string> {
    return Observable.fromPromise(this.db.put(patient)
      .then((result: IPouchDBPutResult): string => {
        return result.id;
      }));
  }

  public getPatient(id: string): Observable<Patient> {
    return this.dbChange$.startWith({})
      .switchMap(() => this.fetchPatient(id),
      (outer, inner) => {
        return inner;
      });
  }

  public fetchPatient(id: string): Observable<Patient> {

    const query = {
      selector: {
        '_id': { $eq: id }
      }
    };

    return Observable.fromPromise(this.db.find(query)
      .then((result: IPouchDBFindPatientsResult): Patient => {
        return result.docs.length ? result.docs[0] : null;
      }));
  }

  public editPatientInfo(id: string, rev: string, name: string, surname: string,
    address: Address, profession: string, dateOfBirth: Date, medicalHistory: MedicalHistoryItem[]): Observable<Patient> {
    return Observable.fromPromise(this.db.get(id)
      .then((doc: Patient): IPouchDBPutResult => {
        return this.db.put({
          _id: id,
          _rev: rev,
          personalInfo: {
            name: name,
            surname: surname,
            dateOfBirth: dateOfBirth,
            address: address,
            profession: profession
          },
          medicalHistory: medicalHistory
        });
      }));
  }

  public removeMedicalHistoryItem(id: string, medHistory: MedicalHistoryItem[]) {
    return Observable.fromPromise(this.db.get(id)
      .then((doc: Patient): IPouchDBPutResult => {
        return this.db.put({
          _id: doc._id,
          _rev: doc._rev,
          personalInfo: doc.personalInfo,
          medicalHistory: medHistory
        });
      }));
  }

  public deletePatient(id: string, rev: string): Observable<IPouchDBRemoveResult> {
    return Observable.fromPromise(this.db.get(id)
      .then((doc: Patient) => {
        return this.db.remove(doc);
      }));
  }

  public addTherapy(id: string, rev: string, personalInfo: PatientPersonalInfo, medicalHistory: MedicalHistoryItem[]): Observable<Patient> {
    return Observable.fromPromise(this.db.get(id)
      .then((doc: Patient): IPouchDBPutResult => {
        return this.db.put({
          _id: doc._id,
          _rev: doc._rev,
          personalInfo: personalInfo,
          medicalHistory: medicalHistory
        });
      }));
  }

  public fetchPatientCount(): Observable<number> {
    return Observable.fromPromise(this.db.info())
    .map((result: any): number => {
      return result.doc_count - 1;
      });
  }

  public patientsCount(): Observable<number> {
    return this.dbChange$.startWith({})
      .switchMap(() => this.fetchPatientCount(),
      (outer, inner) => {
        return inner;
      }
    );
  }

  public allPatients(): Observable<Patient[]> {
    return this.dbChange$.startWith({})
      .switchMap(() => this.fetchAllPatients(),
      (outer, inner) => {
        return inner;
      });
  }

  public fetchAllPatients(): Observable<Patient[]> {
    return Observable.fromPromise(this.db.allDocs({
      include_docs: true,
      startkey: 'patient:'
    }).then((result: IPouchDBAllDocsResult): Patient[] => {
      return result.rows.map((row: any): Patient => {
        return ({
          _id: row.doc._id,
          _rev: row.doc._rev,
          personalInfo: row.doc.personalInfo,
          medicalHistory: row.doc.medicalHistory
        });
      });
    }));
  }

  public therapiesCount(): Observable<number> {
    return this.dbChange$.startWith({})
      .switchMap(() => this.fetchTherapiesCount(),
        (outer, inner) => {
          return inner;
        }
      );
  }

  public fetchTherapiesCount(): Observable<number> {
    return Observable.fromPromise(this.db.allDocs({
      include_docs: true,
      startkey: 'patient:'
    })).map((result: IPouchDBDocsResult<Patient>) => {
      let count = 0;
      result.rows.forEach((row) => {
        if (!isNullOrUndefined(row.doc.medicalHistory)) {
          count += row.doc.medicalHistory.length;
        }
      });

      return count;
    });
  }
}
