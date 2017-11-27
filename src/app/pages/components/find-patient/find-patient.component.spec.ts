import { PouchDbBootService } from './../../../api/pouchdb-service/pouchdb-boot.service';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { FindPatientComponent } from './find-patient.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('FindPatientComponent', () => {
  let component: FindPatientComponent;
  let fixture: ComponentFixture<FindPatientComponent>;
  let routerMock;
  let patientAPIServiceStub;

  class PatientAPIServiceMock {
    patientsMock = [
      {
        '_id': 'patient:1509005061016',
        '_rev': '9-b4d74744e2e6432e859aea75585fee7d',
        'personalInfo': {
          'name': 'Jeca',
          'surname': 'Smeca',
          'dateOfBirth': '6/14/2017',
          'address': {
            'country': 'Serbia',
            'city': 'Belgrade',
            'postcode': '11000',
            'street': 'Brace Jerkovic',
            'streetNo': '213'
          },
          'profession': 'Student'
        },
        'medicalHistory': []
      },
      {
        '_id': 'patient:1509005061017',
        '_rev': '9-b4d74744e2e6432e859aea75585fee7d',
        'personalInfo': {
          'name': 'Danilo',
          'surname': 'Krasic',
          'dateOfBirth': '6/14/2017',
          'address': {
            'country': 'Serbia',
            'city': 'Belgrade',
            'postcode': '11000',
            'street': 'Brace Jerkovic',
            'streetNo': '213'
          },
          'profession': 'Student'
        },
        'medicalHistory': []
      },
      {
        '_id': 'patient:1509005061018',
        '_rev': '9-b4d74744e2e6432e859aea75585fee7d',
        'personalInfo': {
          'name': 'Pera',
          'surname': 'Peric',
          'dateOfBirth': '6/14/2017',
          'address': {
            'country': 'Serbia',
            'city': 'Belgrade',
            'postcode': '11000',
            'street': 'Brace Jerkovic',
            'streetNo': '213'
          },
          'profession': 'Student'
        },
        'medicalHistory': []
      }
    ];

    public getAllPatients() {
      return Promise.resolve(this.patientsMock);
    }
  }

  beforeEach(async(() => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: PatientAPIService, useClass: PatientAPIServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ComponentFixtureAutoDetect, useValue: true  },
        PouchDbBootService
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, FormsModule],
      declarations: [FindPatientComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPatientComponent);
    component = fixture.componentInstance;
    patientAPIServiceStub = TestBed.get(PatientAPIService);
  });

  afterEach(() => {
    component = null;
  });

  it('should call getAllPatients method from the PatientAPIService', () => {
      spyOn(patientAPIServiceStub, 'getAllPatients').and.callThrough();
      component.ngOnInit();
      expect(patientAPIServiceStub.getAllPatients).toHaveBeenCalled();
    });

  it('should get all patients from the service',
    fakeAsync(() => {
      component.ngOnInit();
      tick();
      fixture.detectChanges();
      expect(component.patients.length).toEqual(3);
      expect(component.patients[1].personalInfo.surname).toEqual('Krasic');
    }));

  it('should open specific patients card when button is clicked', () => {
    component.openPatient('patient:1509005061016');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/patient/patient:1509005061016']);
  });
});
