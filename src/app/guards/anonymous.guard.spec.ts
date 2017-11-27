import { TestBed } from '@angular/core/testing';

import { AnonymousGuard } from './anonymous.guard';

describe('AnonymousGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnonymousGuard]
    });
  });
});
