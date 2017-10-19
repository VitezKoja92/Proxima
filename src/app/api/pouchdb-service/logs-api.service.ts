import { Injectable } from '@angular/core';
import { PouchDbBootService } from './pouchdb-boot.service';

@Injectable()
export class LogsAPIService {

  constructor(protected PouchDbBootService: PouchDbBootService) {
   }

}
