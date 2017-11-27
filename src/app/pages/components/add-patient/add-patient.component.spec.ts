import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AddPatientComponent } from './add-patient.component';
import { MaterialModule } from '../../../modules/material.module';
import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { PouchDbBootService } from './../../../api/pouchdb-service/pouchdb-boot.service';

describe('AddPatientComponent', () => {
  let component: AddPatientComponent;
  let fixture: ComponentFixture<AddPatientComponent>;

  const data = {
    name: 'name',
    surename: 'surname',
    date: 'date',
    city: 'city',
    country: 'country',
    postCode: 'postCode',
    street: 'street',
    streetNr: 'streetNr',
    profession: 'profession'
  };

  class PatientAPIServiceMock {
    public addPatient() {
      return {
        then: () => null
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers : [
        { provide: PatientAPIService, useClass: PatientAPIServiceMock},
        UserAPIService,
        PouchDbBootService
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [ AddPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component = null;
  });

  it('should call getAllPatients method from the PatientAPIService', inject([PatientAPIService], (PatientAPIService: PatientAPIService) => {
    spyOn(PatientAPIService, 'addPatient').and.callThrough();
    component.addPatient(data);
    expect(PatientAPIService.addPatient).toHaveBeenCalled();
  }));
});
