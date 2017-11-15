import { TestBed, inject } from '@angular/core/testing';

import { UserAPIService } from './user-api.service';
import { PouchDbBootService } from './pouchdb-boot.service';
import { PouchDbBootServiceMock } from './pouchdb-boot.service.mock';
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { User } from '../models/index';

const userMock = {
  '_id': 'id1',
  'username': 'username1',
  'password': 'password1',
  'name': 'name1',
  'surname': 'surname1',
  'email': 'email1',
  'phoneNr': 'phoneNr1'
};

describe('UserAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserAPIService,
        { provide: PouchDbBootService, useClass: PouchDbBootServiceMock }
      ]
    });
  });

  it('should return the id when the user is added in the database', fakeAsync( inject([UserAPIService], (service: UserAPIService) => {
    let id = '';
    service.addUser(userMock)
      .then((res: string) => {
        id = res;
      });
    tick();
    expect(id).toEqual('id1');
  })));

  it('should get the specific user from the database', fakeAsync( inject([UserAPIService], (service: UserAPIService) => {
    let myUser = null;
    service.getUser(userMock.username)
      .then((res: User) => {
        myUser = res;
      });
    tick();
    console.log(myUser);
    console.log('mock:', userMock);
    expect(myUser).toEqual(userMock);
  })));
});
