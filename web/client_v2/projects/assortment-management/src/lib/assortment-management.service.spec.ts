import { TestBed } from '@angular/core/testing';

import { AssortmentManagementService } from './assortment-management.service';

describe('AssortmentManagementService', () => {
  let service: AssortmentManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssortmentManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
