import { PouchDbBootServiceMock } from './../../../api/pouchdb-service/pouchdb-boot.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { MaterialModule } from '../../../modules/material.module';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { PouchDbBootService } from './../../../api/pouchdb-service/pouchdb-boot.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let patientAPIServiceStub;
  let pouchDbBootServiceStub;

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
        PatientAPIService,
        AppointmentAPIService,
        { provide: PouchDbBootService, useClass: PouchDbBootServiceMock}
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, FormsModule],
      declarations: [DashboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    pouchDbBootServiceStub = TestBed.get(PouchDbBootService);
    patientAPIServiceStub = TestBed.get(PatientAPIService);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component = null;
  });

  it('should call getPatientCount method from the PatientAPIService in getAllPatientCount method', () => {
      spyOn(patientAPIServiceStub, 'getPatientCount').and.callThrough();
      component.getAllPatientCount();
      expect(patientAPIServiceStub.getPatientCount).toHaveBeenCalled();
    });
});
