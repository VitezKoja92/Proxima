import { Injectable } from '@angular/core';
import * as PouchDBlib from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

import Configuration = PouchDB.Configuration;

@Injectable()
export class PouchDbBootService {

  lib: any;

  constructor() {
    this.lib = PouchDBlib;
    this.lib.default.plugin(PouchDBFind.default);
  }

  useDatabase(dbName: string, options: Configuration.DatabaseConfiguration): PouchDB.Static {
    return new this.lib.default(dbName, options) as PouchDB.Static;
  }
}
