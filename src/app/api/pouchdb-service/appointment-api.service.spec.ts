import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { AppointmentAPIService } from './appointment-api.service';
import { PouchDbBootService } from './pouchdb-boot.service';
import { PouchDbBootServiceMock } from './pouchdb-boot.service.mock';
import { Appointment } from './../models/index';

describe('AppointmentApiService', () => {

  let db;
  let appointmentAPIServiceStub;
  let pouchDbBootServiceStub;

  const appointmentsMock = [
    {
      '_id': 'id1',
      '_rev': 'rev1',
      'user': null,
      'patient': null,
      'date': new Date(),
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppointmentAPIService,
        { provide: PouchDbBootService, useClass: PouchDbBootServiceMock }
      ]
    });
  });

  beforeEach(() => {
    pouchDbBootServiceStub = TestBed.get(PouchDbBootService);
    appointmentAPIServiceStub = TestBed.get(AppointmentAPIService);
    spyOn(console, 'log').and.callThrough();
    db = pouchDbBootServiceStub.useDatabase('db', null);
  });

  it('should log an error when the pouch is not able to create indices', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'createIndex').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.createIndexes().then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  it('should get the first appointment from the database', (done) => {
    appointmentAPIServiceStub.getAppointment(appointmentsMock[0].date, appointmentsMock[0].hour, appointmentsMock[0].minute)
      .then((res: Appointment) => {
        expect(res).toEqual(appointmentsMock[0]);
        done();
      });
  });

  it('should log an error when it tries to get a specific appointment from the database', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'find').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.getAppointment(null, 3, 3).then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  it('should return the id when the appointment is added in the database', (done) => {
    appointmentAPIServiceStub.addAppointment(appointmentsMock[0])
        .then((res: string) => {
          expect(res).toEqual('id1');
          done();
        });
    });

  it('should return the id when the appointment is removed', (done) => {
    appointmentAPIServiceStub.deleteAppointment(appointmentsMock[0]._id)
        .then((res: any) => {
          expect(res.id).toEqual('id1');
          done();
        });
    });

  it('should return the error if appointment was not able to be removed', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'get').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.deleteAppointment('id3').then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  it('should return the id when the appointment is edited in the database',
    fakeAsync(inject([AppointmentAPIService], (service: AppointmentAPIService) => {
      service.editAppointment(appointmentsMock[0]._id, appointmentsMock[0]._rev, appointmentsMock[0].date,
        appointmentsMock[0].description, appointmentsMock[0].patient, appointmentsMock[0].user, appointmentsMock[0].hour, 3)
        .then((res: any) => {
          expect(res.id).toEqual('id1');
        });
    })));

  it('should return the error if appointment was not able to be edited', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'get').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.editAppointment(appointmentsMock[0]._id, appointmentsMock[0]._rev, appointmentsMock[0].date,
      appointmentsMock[0].description, appointmentsMock[0].patient, appointmentsMock[0].user, appointmentsMock[0].hour, 3).then(() => {
        expect(console.log).toHaveBeenCalled();
        done();
      });
  });

  // Problem: we need to have two different implementations of allDocs method in
  // pouchdb-boot.service.mock.ts in order to test both for users and appointments (or patients)

  // it('should get from the database the appointments scheduled for today', (done) => {
  //   appointmentAPIServiceStub.getAppointmentsToday()
  //   .subscribe((res: Appointment[]) => {
  //     expect(res[0]).toEqual(appointmentsMock[0]);
  //     done();
  //   });
  // });
});
