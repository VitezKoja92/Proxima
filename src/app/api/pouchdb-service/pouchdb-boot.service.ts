import { Injectable } from '@angular/core';
import * as PouchDBlib from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

import Configuration = PouchDB.Configuration;

@Injectable()
export class PouchDbBootService {
  useDatabase(dbName: string, options: Configuration.DatabaseConfiguration): PouchDB.Static {
    const lib: any = PouchDBlib;
    lib.default.plugin(PouchDBFind.default);
    return new lib.default(dbName, options) as PouchDB.Static;
  }
}
