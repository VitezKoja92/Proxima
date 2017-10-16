import { TestBed, inject } from '@angular/core/testing';

import { UserAPIService } from './user-api.service';

describe('PouchdbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAPIService]
    });
  });

  it('should be created', inject([UserAPIService], (service: UserAPIService) => {
    expect(service).toBeTruthy();
  }));
});
