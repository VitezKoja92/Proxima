import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService]
    });

  });

  // it('should return true from isSessionValid if there is a currentUser', () => {

  // });
  // it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
  //   expect(service).toBeTruthy();
  // }));
});
