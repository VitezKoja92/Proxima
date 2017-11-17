import { isNullOrUndefined } from 'util';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Patient } from './../../../api/models/index';

@Component({
  selector: 'app-find-patient',
  templateUrl: './find-patient.component.html',
  styleUrls: ['./find-patient.component.scss']
})
export class FindPatientComponent implements OnInit{

  patients: Patient[];
  filteredPatients: Patient[];
  form: FormGroup;

  constructor(
    private Router: Router,
    private PatientAPIService: PatientAPIService,
    private FormBuilder: FormBuilder
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
    this.getAllPatients()
      .then((patients: Patient[]) => {
        this.patients = patients;
        this.filteredPatients = patients;
      });
  }

  getAllPatients(): Promise<Patient[]> {
    return this.PatientAPIService.getAllPatients()
      .then((patients: Patient[]): Patient[] => {
        return patients;
      });
  }

  openPatient(id: string): void {
    this.Router.navigate(['/patient/' + id]);
  }
}
