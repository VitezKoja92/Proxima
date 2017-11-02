import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';

import { PouchDbBootService } from './pouchdb-boot.service';
import { MedicalHistoryItem, PatientPersonalInfo } from './../models/index';
import { environment } from './../../../environments/environment';
import { IPouchDBCreateIndexResult } from '../models/index';
import {
  Patient,
  IPouchDBAllDocsResult,
  IPouchDBPutResult,
  IPouchDBFindPatientsResult,
  Address
} from './../models/index';

@Injectable()
export class PatientAPIService {

  private db;
  private dbName = 'patients_proxima';

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
        fields: ['personalInfo.name, personalInfo.surname, personalInfo.dateOfBirth,' +
          'address.country, address.city, address.street, address.streetNo, profession']
      }
    }).then((result: IPouchDBCreateIndexResult) => {
    }).catch((err) => {
      console.log(err);
    });
  }

  public getNumberOfPatients(): Promise<Number> {
    const promise = this.db.allDocs({
      include_docs: true,
      startkey: 'patient:'
    }).then((result: IPouchDBAllDocsResult): Number => {
      return result.rows.length;
    });
    return promise;
  }

  public addPatient(patient: Patient): Promise<string> {
    return this.db.put(patient)
      .then((result: IPouchDBPutResult): string => {
        return result.id;
      });
  }

  public getPatient(id: string): Promise<Patient> {

    const query = {
      selector: {
        '_id': { $eq: id }
      }
    };

    return this.db.find(query)
      .then((result: IPouchDBFindPatientsResult): Patient => {
        return result.docs.length ? result.docs[0] : null;
      }).catch((error: Error) => {
        console.log('Error: ', error);
      });
  }

  public editPatientInfo(id: string, rev: string, name: string, surname: string,
    address: Address, profession: string, dateOfBirth: Date, medicalHistory: MedicalHistoryItem[]): Promise<Patient> {
    return this.db.get(id)
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
      }
      ).then((res: string): void => {
      }).catch((error: Error): void => {
        console.log('Error: ', error);
      });
  }

  public addTherapy(id: string, rev: string, personalInfo: PatientPersonalInfo, medicalHistory: MedicalHistoryItem[]): Promise<Patient> {
    return this.db.get(id)
      .then((doc: Patient): IPouchDBPutResult => {
        return this.db.put({
          _id: id,
          _rev: rev,
          personalInfo: personalInfo,
          medicalHistory: medicalHistory
        });
      }
      ).then((res: string): void => {
      }).catch((error: Error): void => {
        console.log('Error: ', error);
      });
  }


  public getAllPatients(): Promise<Patient[]> {
    return this.db.allDocs({
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
      });
  }
}
