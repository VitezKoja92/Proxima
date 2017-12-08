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
      'dateTime': new Date(2017, 11, 8),
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

  // -------- fetchAppointmentsToday --------
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
        done();
      });
  });

  // -------- todayAppointments --------
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
        done();
      });
  });

  // -------- createIndexes --------
  it('should log an error when the pouch is not able to create indices', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'createIndex').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.createIndexes().then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  // -------- getAppointment --------
  it('should get the first appointment from the database', (done) => {
    appointmentAPIServiceStub.getAppointment(appointmentsMock[0].dateTime)
      .subscribe((res: Appointment) => {
        expect(res).toEqual(appointmentsMock[0]);
        done();
      });
  });

  // -------- addAppointment --------
  it('should return the id when the appointment is added in the database', (done) => {
    appointmentAPIServiceStub.addAppointment(appointmentsMock[0])
      .subscribe((res: string) => {
        expect(res).toEqual('id1');
        done();
      });
  });

  // -------- deleteAppointment --------
  it('should return the id when the appointment is removed', (done) => {
    appointmentAPIServiceStub.deleteAppointment(appointmentsMock[0]._id)
      .subscribe((res: any) => {
        expect(res.id).toEqual('id1');
        done();
      });
  });

  it('should return the error if appointment was not able to be removed', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'get').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.deleteAppointment('id3').subscribe(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  // -------- editAppointment --------
  it('should return the id when the appointment is edited in the database', (done) => {
    appointmentAPIServiceStub.editAppointment(appointmentsMock[0]._id, appointmentsMock[0]._rev, appointmentsMock[0].dateTime,
      appointmentsMock[0].description, appointmentsMock[0].patient, appointmentsMock[0].user)
      .subscribe((res: any) => {
        expect(res.id).toEqual('id1');
        done();
      });
  });

  it('should return the error if appointment was not able to be edited', (done) => {
    spyOn(appointmentAPIServiceStub.db, 'get').and.returnValue(Promise.reject('error'));
    appointmentAPIServiceStub.editAppointment(appointmentsMock[0]._id, appointmentsMock[0]._rev, appointmentsMock[0].dateTime,
      appointmentsMock[0].description, appointmentsMock[0].patient, appointmentsMock[0].user).subscribe(() => {
        expect(console.log).toHaveBeenCalled();
        done();
      });
  });

  // -------- fetchAllAppointments --------
  it('should call the allDocs() function from db when fetchAppointmentsToday() is called', () => {
    spyOn(appointmentAPIServiceStub.db, 'allDocs').and.callThrough();
    appointmentAPIServiceStub.fetchAllAppointments();
    expect(appointmentAPIServiceStub.db.allDocs).toHaveBeenCalled();
  });

  it('should get all appointments from the database', (done) => {
    appointmentAPIServiceStub.fetchAllAppointments()
      .subscribe((res) => {
        appointmentsMock.forEach((appointment) => {
          expect(res).toContain(appointment);
        });
        done();
      });
  });

  // -------- allAppointments --------
  it('should return all appointments', (done) => {
    appointmentAPIServiceStub.allAppointments()
      .subscribe((res) => {
          appointmentsMock.forEach((appointment) => {
            expect(res).toContain(appointment);
          });
        done();
      });
  });

  // -------- dateSort() --------
  it('should sort the date in dateSort function', () => {
    expect(appointmentAPIServiceStub.dateSort(appointmentsMock[0], appointmentsMock[1])).toEqual(1);
    expect(appointmentAPIServiceStub.dateSort(appointmentsMock[1], appointmentsMock[0])).toEqual(-1);
  });
});
