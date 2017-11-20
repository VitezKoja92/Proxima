import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { UserAPIService } from './user-api.service';
import { PouchDbBootService } from './pouchdb-boot.service';
import { PouchDbBootServiceMock } from './pouchdb-boot.service.mock';
import { User } from '../models/index';

const userMock = [
  {
    '_id': 'id1',
    'username': 'username1',
    'password': 'password1',
    'name': 'name1',
    'surname': 'surname1',
    'email': 'email1',
    'phoneNr': 'phoneNr1'
  },
  {
    '_id': 'id2',
    'username': 'username2',
    'password': 'password2',
    'name': 'name2',
    'surname': 'surname2',
    'email': 'email2',
    'phoneNr': 'phoneNr2'
  }
];

describe('UserAPIService', () => {

  let db;

  let userAPIServiceStub;
  let pouchDbBootServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserAPIService,
        {provide: PouchDbBootService, useClass: PouchDbBootServiceMock}
      ]
    });
  });

  beforeEach(() => {
    pouchDbBootServiceStub = TestBed.get(PouchDbBootService);
    userAPIServiceStub = TestBed.get(UserAPIService);
    spyOn(console, 'log').and.callThrough();
    db = pouchDbBootServiceStub.useDatabase('db', null);
  });

  it('should return the id when the user is added in the database', fakeAsync(inject([UserAPIService], (service: UserAPIService) => {
    let id = '';
    service.addUser(userMock[0])
      .then((res: string) => {
        id = res;
      });
    tick();
    expect(id).toEqual('id1');
  })));

  it('should get the first user from the database', fakeAsync(inject([UserAPIService], (service: UserAPIService) => {
    let myUser = null;
    service.getUser(userMock[0].username)
      .then((res: User) => {
        myUser = res;
      });
    tick();
    expect(myUser).toEqual(userMock[0]);
  })));

  it('should get the first user from the database (when both username and password are provided)',
    fakeAsync(inject([UserAPIService], (service: UserAPIService) => {
      let myUser = null;
      service.getUser(userMock[0].username, userMock[0].password)
        .then((res: User) => {
          myUser = res;
        });
      tick();
      expect(myUser).toEqual(userMock[0]);
    })));

  it('should get the second user from the database', fakeAsync(inject([UserAPIService], (service: UserAPIService) => {
    let myUser = null;
    service.getUser(userMock[1].username)
      .then((res: User) => {
        myUser = res;
      });
    tick();
    expect(myUser).toEqual(userMock[1]);
  })));

  it('should get the null instead of user from the database', fakeAsync(inject([UserAPIService], (service: UserAPIService) => {
    let myUser = null;
    service.getUser('username3')
      .then((res: User) => {
        myUser = res;
      });
    tick();
    expect(myUser).toEqual(null);
  })));

  it('should log an error when it tries to get a specific user', (done) => {
    spyOn(userAPIServiceStub.db, 'find').and.returnValue(Promise.reject('error'));

    userAPIServiceStub.getUser('username', 'password').then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  it('should log an error when the pouch is not able to create indices', (done) => {
    spyOn(userAPIServiceStub.db, 'createIndex').and.returnValue(Promise.reject('error'));
    userAPIServiceStub.createIndexes().then(() => {
      expect(console.log).toHaveBeenCalled();
      done();
    });
  });

  it('should get all users from the database', (done) => {
    userAPIServiceStub.getAllUsers()
      .then((res: User[]) => {
        expect(res).toEqual(userMock);
        done();
      });
  });
});
