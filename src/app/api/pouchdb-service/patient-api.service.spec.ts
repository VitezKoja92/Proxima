import { TestBed } from '@angular/core/testing';

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
      },
      {
        '_id': 'id3',
        'date': 'date3',
        'anamnesis': null,
        'diagnostics': null,
        'statusLocalis': 'statusLocalis3',
        'diagnosis': 'diagnosis3',
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
    patientsMock.forEach((item) => {
      patientAPIServiceStub.db.put(item);
    });
  });

  // -------- patientsCount --------
  it('should get the number of patients from the database', (done) => {
    patientAPIServiceStub.patientsCount()
      .subscribe((res: number) => {
        expect(res + 1).toEqual(patientsMock.length);
        done();
      });
  });

  // -------- therapiesCount --------
  it('should get the number of therapies from the database', (done) => {
    let count = 0;
    patientsMock.forEach((patient) => {
      count += patient.medicalHistory.length;
    });
    patientAPIServiceStub.therapiesCount()
      .subscribe((res: number) => {
        expect(res).toEqual(count);
        done();
      });
  });

  // -------- createIndexes --------
  it('should log an error when the pouch is not able to create indices', (done) => {
    spyOn(patientAPIServiceStub.db, 'createIndex').and.returnValue(Promise.reject('error'));
    patientAPIServiceStub.createIndexes().then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  // -------- addPatient --------
  it('should return the id when the patient is added in the database', (done) => {
    patientAPIServiceStub.addPatient(patientsMock[0])
      .subscribe((res: string) => {
        expect(res).toEqual('id1');
        done();
      });
  });

  // -------- getPatient --------
  it('should get the first patient from the database', (done) => {
    patientAPIServiceStub.getPatient(patientsMock[0]._id)
      .subscribe((res: Patient) => {
        expect(res).toEqual(patientsMock[0]);
        done();
      });
  });

  // -------- editPatientInfo --------
  it('should return the id when the patient is edited in the database', (done) => {
    patientAPIServiceStub.editPatientInfo(patientsMock[0]._id, patientsMock[0]._rev, patientsMock[0].personalInfo.name,
      patientsMock[0].personalInfo.surname, patientsMock[0].personalInfo.address, patientsMock[0].personalInfo.profession,
      patientsMock[0].personalInfo.dateOfBirth, patientsMock[0].medicalHistory)
      .subscribe((res: any) => {
        expect(res.id).toEqual('id1');
        done();
      });
  });

  // -------- removeMedicalHistoryItem --------
  it('should return the id when the patient\'s medical history is edited in the database', (done) => {
    patientAPIServiceStub.removeMedicalHistoryItem(patientsMock[0]._id, patientsMock[0].medicalHistory)
      .subscribe((res: any) => {
        expect(res.id).toEqual('id1');
        done();
      });
  });

  // -------- deletePatient --------
  it('should return the id when the patient is removed', (done) => {
    patientAPIServiceStub.deletePatient(patientsMock[0]._id, patientsMock[0]._rev)
      .subscribe((res: any) => {
        expect(res.id).toEqual('id1');
        done();
      });
  });

  // -------- addTherapy --------
  it('should return the id when the patient\'s therapy is added in the database', (done) => {
    patientAPIServiceStub.addTherapy(patientsMock[0]._id, patientsMock[0]._rev, patientsMock[0].personalInfo,
      patientsMock[0].medicalHistory)
      .subscribe((res: any) => {
        expect(res.id).toEqual('id1');
        done();
      });
  });

  // -------- allPatients --------
  it('should return all patients', (done) => {
    patientAPIServiceStub.allPatients()
      .subscribe((res) => {
        patientsMock.forEach((patient) => {
          expect(res).toContain(patient);
        });
        done();
      });
  });

  // -------- fetchAllPatients --------
  it('should call the allDocs() function from db when fetchAllPatients() is called', () => {
    spyOn(patientAPIServiceStub.db, 'allDocs').and.callThrough();
    patientAPIServiceStub.fetchAllPatients();
    expect(patientAPIServiceStub.db.allDocs).toHaveBeenCalled();
  });

  it('should get all patients from the database', (done) => {
    patientAPIServiceStub.fetchAllPatients()
      .subscribe((res) => {
        patientsMock.forEach((patient) => {
          expect(res).toContain(patient);
        });
        done();
      });
  });
});
