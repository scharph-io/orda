import { TestBed } from '@angular/core/testing';

import { ViewGroupService } from './view-group.service';

describe('ViewGroupService', () => {
  let service: ViewGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
