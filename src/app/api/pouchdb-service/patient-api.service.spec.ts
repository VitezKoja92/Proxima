import { TestBed, inject } from '@angular/core/testing';

import { PatientAPIService } from './patient-api.service';

describe('PatientApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientAPIService]
    });
  });

  it('should be created', inject([PatientAPIService], (service: PatientAPIService) => {
    expect(service).toBeTruthy();
  }));
});
