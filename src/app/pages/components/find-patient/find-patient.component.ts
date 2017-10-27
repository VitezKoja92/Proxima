import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Patient } from './../../../api/models/index';
import { SearchFilterPipe } from './../../../api/models/search-filter-pipe';

@Component({
  selector: 'app-find-patient',
  templateUrl: './find-patient.component.html',
  styleUrls: ['./find-patient.component.scss']
})
export class FindPatientComponent {

  patients: Patient[];

  constructor(private Router: Router, private PatientAPIService: PatientAPIService) {
    this.getAllPatients();
  }

  // search items

  // end

  getAllPatients(): void {
    this.PatientAPIService.getAllPatients()
      .then((patients: Patient[]): void => {
        this.patients = patients;
        console.log('Patients from db: ', patients);
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  openPatient(id: string): void {
    this.Router.navigate(['/patient/' + id]);
  }

}
