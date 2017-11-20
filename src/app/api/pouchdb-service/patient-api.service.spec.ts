import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { PatientAPIService } from './patient-api.service';
import { PouchDbBootService } from './pouchdb-boot.service';
import { PouchDbBootServiceMock } from './pouchdb-boot.service.mock';
import { Patient } from '../models/index';

let db;
let patientAPIServiceStub;
let pouchDbBootServiceStub;

const patientsMock = [
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

describe('PatientApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientAPIService,
        { provide: PouchDbBootService, useClass: PouchDbBootServiceMock }
      ]
    });
  });

  beforeEach(() => {
    pouchDbBootServiceStub = TestBed.get(PouchDbBootService);
    patientAPIServiceStub = TestBed.get(PatientAPIService);
    spyOn(console, 'log').and.callThrough();
    db = pouchDbBootServiceStub.useDatabase('db', null);
  });

  it('should log an error when the pouch is not able to create indices', (done) => {
    spyOn(patientAPIServiceStub.db, 'createIndex').and.returnValue(Promise.reject('error'));
    patientAPIServiceStub.createIndexes().then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  it('should return the id when the patient is added in the database', (done) => {
    patientAPIServiceStub.addPatient(patientsMock[0])
      .then((res: string) => {
        expect(res).toEqual('id1');
        done();
      });
  });

  it('should get the first patient from the database', fakeAsync(inject([PatientAPIService], (service: PatientAPIService) => {
    service.getPatient(patientsMock[0]._id)
      .then((res: Patient) => {
        expect(res).toEqual(patientsMock[0]);
      });
  })));

  it('should log an error when it tries to get a specific patient from the database', (done) => {
    spyOn(patientAPIServiceStub.db, 'find').and.returnValue(Promise.reject('error'));
    patientAPIServiceStub.getPatient('someId').then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });
});
