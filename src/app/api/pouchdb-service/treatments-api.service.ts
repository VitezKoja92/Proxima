import { Injectable } from '@angular/core';

import { PouchDbBootService } from './pouchdb-boot.service';
import { environment } from '../../../environments/environment';
import { IPouchDBAllDocsResult } from '../models/index';

@Injectable()
export class TreatmentsAPIService {

  private db;
  private dbName = 'treatments_proxima';

  constructor(private PouchDbBootService: PouchDbBootService) {

    // Database creation
    this.db = this.PouchDbBootService.useDatabase(
      this.dbName,
      {
        auto_compaction: true,
        revs_limit: 2
      }
    );

    // Database synchronization
    this.db.sync(`${environment.couch_url}${this.dbName}`, {
      live: true,
      retry: true
    }).on('change', function (change) {
      console.log('Something is changed: ', change);
    }).on('paused', function (info) {
      console.log('Paused: ', info);
    }).on('active', function (info) {
      console.log('Active(resumed): ', info);
    }).on('error', function (err) {
      console.log('Error: ', err);
    });

    // // Index creation
    // this.db.createIndex({
    //   index: {
    //     fields: [ /* Add fields */ ]
    //   }
    // }).then((result: IPouchDBCreateIndexResult) => {
    //   // handle result
    // }).catch((err) => {
    //   console.log(err);
    // });

  }

  public getNumberOfTreatments(): Promise<Number> {
    const promise = this.db.allDocs({
      include_docs: true
    }).then(
      (result: IPouchDBAllDocsResult): Number => {
        return result.total_rows;
      }
    );
    return promise;
  }

}
