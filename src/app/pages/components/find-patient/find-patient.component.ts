import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Patient } from './../../../api/models/index';

@Component({
  selector: 'app-find-patient',
  templateUrl: './find-patient.component.html',
  styleUrls: ['./find-patient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FindPatientComponent implements OnInit, OnDestroy {

  patients: Patient[];
  filteredPatients: Patient[];
  form: FormGroup;

  subs: Subscription[] = [];

  constructor(
    private Router: Router,
    private PatientAPIService: PatientAPIService,
    private FormBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
      this.form = this.FormBuilder.group({
        'search': []
      });

      this.form.controls['search'].valueChanges.subscribe((value: string): void => {
        if (!isNullOrUndefined(value)) {
          this.filteredPatients = this.patients.filter((patient: Patient) => {
            return patient.personalInfo.name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
            patient.personalInfo.surname.toLowerCase().indexOf(value.toLowerCase()) > -1;
          });
        }
      }) ;
  }

  ngOnInit(): void {
    this.subs.push(this.PatientAPIService.allPatients()
      .subscribe((patients: Patient[]) => {
        this.patients = patients;
        this.filteredPatients = patients;
        this.changeDetectorRef.detectChanges();
      }));
  }

  openPatient(id: string): void {
    this.Router.navigate(['/patient/' + id]);
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.changeDetectorRef.detach();
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
