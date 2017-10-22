import { TreatmentsAPIService } from './pouchdb-service/treatments-api.service';
import { UserAPIService } from './pouchdb-service/user-api.service';
import { PatientAPIService } from './pouchdb-service/patient-api.service';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { PouchDbBootService } from './pouchdb-service/pouchdb-boot.service';
import { AppointmentAPIService } from './pouchdb-service/appointment-api.service';

@NgModule({
  providers: [
    PouchDbBootService,
    AppointmentAPIService,
    PatientAPIService,
    UserAPIService,
    TreatmentsAPIService
  ],
})
export class ApiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [
        PouchDbBootService,
        AppointmentAPIService,
        PatientAPIService,
        UserAPIService,
        TreatmentsAPIService
      ]
    };
  }
}
