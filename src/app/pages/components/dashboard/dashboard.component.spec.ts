import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import 'rxjs/Rx';

import { DashboardComponent } from './dashboard.component';
import { PouchDbBootServiceMock } from './../../../api/pouchdb-service/pouchdb-boot.service.mock';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { MaterialModule } from '../../../modules/material.module';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { PouchDbBootService } from './../../../api/pouchdb-service/pouchdb-boot.service';

xdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let patientAPIServiceStub;
  let pouchDbBootServiceStub;
  let appointmentAPIServiceStub;
  let routerMock;

  class PatientAPIServiceMock {
    public getAllPatients() {
      return {
        then: () => null
      };
    }
  }

  beforeEach(async(() => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      providers: [
        PatientAPIService,
        AppointmentAPIService,
        { provide: Router, useValue: routerMock },
        { provide: PouchDbBootService, useClass: PouchDbBootServiceMock },
        ChangeDetectorRef
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, FormsModule],
      declarations: [DashboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    pouchDbBootServiceStub = TestBed.get(PouchDbBootService);
    patientAPIServiceStub = TestBed.get(PatientAPIService);
    appointmentAPIServiceStub = TestBed.get(AppointmentAPIService);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component = null;
  });

  it('should call getPatientCount method from the PatientAPIService in getAllPatientCount method', () => {
    spyOn(patientAPIServiceStub, 'patientsCount').and.callThrough();
    component.getAllPatientCount();
    expect(patientAPIServiceStub.patientsCount).toHaveBeenCalled();
  });

  it('should call getTotalTherapiesCount method from the PatientAPIService in getAllTherapiesCount method', () => {
    spyOn(patientAPIServiceStub, 'therapiesCount').and.callThrough();
    component.getAllTherapiesCount();
    expect(patientAPIServiceStub.therapiesCount).toHaveBeenCalled();
  });

  it('should call todayAppointments method from the AppointmentAPIService in getAppointmentsToday method', () => {
    spyOn(appointmentAPIServiceStub, 'todayAppointments').and.callThrough();
    component.getAppointmentsToday();
    expect(appointmentAPIServiceStub.todayAppointments).toHaveBeenCalled();
  });

  it('should set noAppointment variable to false if there are some appointments scheduled for today', fakeAsync(() => {
    component.getAppointmentsToday();
    tick();
    if (component.appointmentsToday.length !== 0) {
      expect(component.noAppointment).toBeFalsy();
    } else {
      expect(component.noAppointment).toBeTruthy();
    }
  }));

  it('should open add-patients page when goToAddPatient() is called', () => {
    component.goToAddPatient();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/add-patient']);
  });

  it('should open find-patients page when goToFindPatients() is called', () => {
    component.goToFindPatients();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/find-patient']);
  });

  it('should open set-appointment page when goToSetAppointment() is called', () => {
    component.goToSetAppointment();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/set-appointment']);
  });
});
