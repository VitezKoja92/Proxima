import { NgModule, ModuleWithProviders } from '@angular/core';

import { PouchDbBootService } from './PouchDB_Service/pouchdb-boot.service';

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
