import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppointmentsListComponent } from './appointments-list.component';
import { MaterialModule } from '../../../modules/material.module';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { PouchDbBootService } from '../../../api/pouchdb-service/pouchdb-boot.service';

describe('AppointmentsListComponent', () => {
  let component: AppointmentsListComponent;
  let fixture: ComponentFixture<AppointmentsListComponent>;
  let date1: Date;
  let date2: Date;

  class AppointmentAPIServiceMock {
    public getAllAppointments() {
      return {
        then: () => null
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AppointmentAPIService, useClass: AppointmentAPIServiceMock},
        PouchDbBootService
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, FormsModule],
      declarations: [ AppointmentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsListComponent);
    component = fixture.componentInstance;

  });

  afterEach(() => {
    component = null;
    date1 = null;
    date2 = null;
  });

  xit('should call getAllAppointments method from the AppointmentAPIService',
    inject([AppointmentAPIService], (AppointmentAPIService: AppointmentAPIService) => {
      spyOn(AppointmentAPIService, 'fetchAllAppointments').and.callThrough();
      component.getAppointments();
      expect(AppointmentAPIService.fetchAllAppointments).toHaveBeenCalled();
  }));
});
