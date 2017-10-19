import { TestBed, inject } from '@angular/core/testing';

import { LogsApiService } from './logs-api.service';

describe('LogsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogsApiService]
    });
  });

  it('should be created', inject([LogsApiService], (service: LogsApiService) => {
    expect(service).toBeTruthy();
  }));
});
