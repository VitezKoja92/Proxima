import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppointmentsListComponent } from './appointments-list.component';
import { MaterialModule } from '../../../modules/material.module';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { PouchDbBootService } from '../../../api/pouchdb-service/pouchdb-boot.service';
import { Appointment } from './../../../api/models/index';


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

  // ***** Methods to test: *****
  // - getAppointments(data: any) - calls the getAllAppointments method from AppointmentAPIService - check if it calls that method
  // - dateSort(a: Appointment, b: Appointment) - checks if a.date is before b.date - check if it works fine

  it('should call getAllAppointments method from the AppointmentAPIService',
    inject([AppointmentAPIService], (AppointmentAPIService: AppointmentAPIService) => {
      spyOn(AppointmentAPIService, 'getAllAppointments').and.callThrough();
      component.getAppointments();
      expect(AppointmentAPIService.getAllAppointments).toHaveBeenCalled();
  }));

  it('should return -1 if dateA is before dateB', () => {
    date1 = new Date(2016, 10, 10);
    date2 = new Date(2017, 10, 10);
    expect(dateSortMock(date1, date2)).toEqual(-1);
  });
});

// Mock functions
function dateSortMock(date1: Date, date2: Date): number {
  if (date1 < date2) {
    return -1;
  } else {
    return 1;
  }
}
