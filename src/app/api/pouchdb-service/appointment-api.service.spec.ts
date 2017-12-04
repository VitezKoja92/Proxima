import { TestBed, inject, fakeAsync } from '@angular/core/testing';

import { AppointmentAPIService } from './appointment-api.service';
import { PouchDbBootService } from './pouchdb-boot.service';
import { PouchDbBootServiceMock } from './pouchdb-boot.service.mock';
import { Appointment } from './../models/index';

describe('AppointmentApiService', () => {

  let db;
  let appointmentAPIServiceStub;
  let pouchDbBootServiceStub;


  const appointmentsMock: Appointment[] = [
    {
      '_id': 'id1',
      '_rev': undefined,
      'user': null,
      'patient': null,
      'dateTime': new Date(2017, 11, 4),
      'description': 'description1'
    },
    {
      '_id': 'id2',
      '_rev': undefined,
      'user': null,
      'patient': null,
      'dateTime': new Date(2017, 11, 4),
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
    appointmentsMock.forEach((item) => {
      appointmentAPIServiceStub.db.put(item);
    });
  });

  // -------- fetchAppointmentsToday() --------
  it('should call the allDocs() function from db when fetchAppointmentsToday() is called', () => {
    spyOn(appointmentAPIServiceStub.db, 'allDocs').and.callThrough();
    appointmentAPIServiceStub.fetchAppointmentsToday();
    expect(appointmentAPIServiceStub.db.allDocs).toHaveBeenCalled();
  });

  it('should get all appointments set for today from the database', (done) => {
    appointmentAPIServiceStub.fetchAppointmentsToday()
      .subscribe((res) => {
        appointmentsMock.filter((appointment) => {
          return appointment.dateTime.getDate() === new Date().getDate() &&
            appointment.dateTime.getMonth() === new Date().getMonth() &&
            appointment.dateTime.getFullYear() === new Date().getFullYear();
        })
        .forEach((appointment) => {
          const myAppointment = new Appointment(appointment.user, appointment.patient,
            appointment.dateTime, appointment.description, appointment._rev);
          myAppointment._id = appointment._id;
          expect(res).toContain(myAppointment);
        });
        expect(res.length).toEqual(appointmentsMock.length);
        done();
      });
  });
  // -------- todayAppointments() --------
  it('should return all today appointments', (done) => {
    appointmentAPIServiceStub.todayAppointments()
      .subscribe((res) => {
        appointmentsMock.filter((appointment) => {
          return appointment.dateTime.getDate() === new Date().getDate() &&
            appointment.dateTime.getMonth() === new Date().getMonth() &&
            appointment.dateTime.getFullYear() === new Date().getFullYear();
        })
        .forEach((appointment) => {
          const myAppointment = new Appointment(appointment.user, appointment.patient,
            appointment.dateTime, appointment.description, appointment._rev);
          myAppointment._id = appointment._id;
          expect(res).toContain(myAppointment);
        });
        expect(res.length).toEqual(appointmentsMock.length);
        done();
      });
  });

  it('should log an error when the pouch is not able to create indices', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'createIndex').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.createIndexes().then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  xit('should get the first appointment from the database', (done) => {
    appointmentAPIServiceStub.getAppointment(appointmentsMock[0].dateTime)
      .then((res: Appointment) => {
        expect(res).toEqual(appointmentsMock[0]);
        done();
      });
  });

  it('should log an error when it tries to get a specific appointment from the database', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'find').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.getAppointment(null).then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  xit('should return the id when the appointment is added in the database', (done) => {
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

  it('should return the id when the appointment is edited in the database', (done) => {
      appointmentAPIServiceStub.editAppointment(appointmentsMock[0]._id, appointmentsMock[0]._rev, appointmentsMock[0].dateTime,
        appointmentsMock[0].description, appointmentsMock[0].patient, appointmentsMock[0].user)
        .then((res: any) => {
          expect(res.id).toEqual('id1');
          done();
        });
    });

  it('should return the error if appointment was not able to be edited', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'get').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.editAppointment(appointmentsMock[0]._id, appointmentsMock[0]._rev, appointmentsMock[0].dateTime,
      appointmentsMock[0].description, appointmentsMock[0].patient, appointmentsMock[0].user).then(() => {
        expect(console.log).toHaveBeenCalled();
        done();
      });
  });

  xit('should get from the database the appointments scheduled for today', (done) => {
    appointmentAPIServiceStub.fetchAppointmentsToday()
    .subscribe((res: Appointment[]) => {
      const appointment = new Appointment(appointmentsMock[0].user, appointmentsMock[0].patient,
        appointmentsMock[0].dateTime, appointmentsMock[0].description);
      expect(res[0]).toEqual(appointment);
      done();
    });
  });

  xit('should call on(type, callback) when we add appointment in db', () => {
    spyOn(appointmentAPIServiceStub.db, 'changes');
    const appointment = new Appointment(appointmentsMock[0].user, appointmentsMock[0].patient,
      appointmentsMock[0].dateTime, appointmentsMock[0].description);
    appointmentAPIServiceStub.addAppointment(appointment);
    expect(appointmentAPIServiceStub.db.changes).toHaveBeenCalled();
  });
});
