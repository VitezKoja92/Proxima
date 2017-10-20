import { TestBed, inject } from '@angular/core/testing';

import { TreatmentsAPIService } from './treatments-api.service';

describe('TreatmentsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreatmentsAPIService]
    });
  });

  it('should be created', inject([TreatmentsAPIService], (service: TreatmentsAPIService) => {
    expect(service).toBeTruthy();
  }));
});
