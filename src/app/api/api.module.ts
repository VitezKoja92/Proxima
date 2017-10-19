import { NgModule, ModuleWithProviders } from '@angular/core';

import { PouchDbBootService } from './pouchdb-service/pouchdb-boot.service';

@NgModule({
  providers: [PouchDbBootService],
})
export class ApiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [ PouchDbBootService ]
    };
  }
}
