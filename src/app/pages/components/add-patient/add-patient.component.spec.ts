import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AddPatientComponent } from './add-patient.component';
import { MaterialModule } from '../../../modules/material.module';
import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { PouchDbBootService } from './../../../api/pouchdb-service/pouchdb-boot.service';
import { PouchDbBootServiceMock } from './../../../api/pouchdb-service/pouchdb-boot.service.mock';

describe('AddPatientComponent', () => {
  let component: AddPatientComponent;
  let fixture: ComponentFixture<AddPatientComponent>;
  let patientAPIServiceStub;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientAPIService,
        UserAPIService,
        { provide: PouchDbBootService, useClass: PouchDbBootServiceMock }
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [AddPatientComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientComponent);
    component = fixture.componentInstance;
    patientAPIServiceStub = TestBed.get(PatientAPIService);
  });

  afterEach(() => {
    component = null;
  });

  // -------- addPatient --------
  it('should call getAllPatients method from the PatientAPIService', () => {
    spyOn(patientAPIServiceStub, 'addPatient').and.callThrough();
    component.addPatient(data);
    expect(patientAPIServiceStub.addPatient).toHaveBeenCalled();
  });

  it('should call add the subscription if the addPatient is called', () => {
    component.addPatient(data);
    expect(component.subs.length).not.toEqual(0);
  });

  // -------- ngOnDestroy --------
  xit('should unsubscribe in ngOnDestroy if there is a subscription in subs', () => {
    component.addPatient(data);
    component.ngOnDestroy();
    expect(component.subs.length).toEqual(0);
  });
});
