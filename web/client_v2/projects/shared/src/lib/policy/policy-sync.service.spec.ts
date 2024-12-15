import { TestBed } from '@angular/core/testing';

import { PolicySyncService } from './policy-sync.service';

describe('PolicySyncService', () => {
  let service: PolicySyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicySyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
