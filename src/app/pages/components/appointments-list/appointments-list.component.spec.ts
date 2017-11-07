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
  // let period: string;

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

  // ***** Methods to test: *****
  // - getAppointments(data: any) - calls the getAllAppointments method from AppointmentAPIService - check if it calls that method

  it('should call getAllAppointments method from the AppointmentAPIService',
    inject([AppointmentAPIService], (AppointmentAPIService: AppointmentAPIService) => {
      spyOn(AppointmentAPIService, 'getAllAppointments').and.callThrough();
      component.getAppointments();
      expect(AppointmentAPIService.getAllAppointments).toHaveBeenCalled();
  }));

});
