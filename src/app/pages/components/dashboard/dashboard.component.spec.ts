import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { MaterialModule } from '../../../modules/material.module';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { PouchDbBootService } from './../../../api/pouchdb-service/pouchdb-boot.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  class PatientAPIServiceMock {
    public getAllPatients() {
      return {
        then: () => null
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PatientAPIService, useClass: PatientAPIServiceMock },
        AppointmentAPIService,
        PouchDbBootService
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, FormsModule],
      declarations: [DashboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component = null;
  });

  // ***** Methods to test: *****
  // - getAllPatients() - calls the getAllPatients method from PatientAPIService - check if it calls that method

  // it('should call getAllPatients method from the PatientAPIService in getNumberOfPatients method',
  //   inject([PatientAPIService], (PatientAPIService: PatientAPIService) => {
  //     spyOn(PatientAPIService, 'getAllPatients').and.callThrough();
  //     component.getAllPatients();
  //     expect(PatientAPIService.getAllPatients).toHaveBeenCalled();
  //   }));
});
