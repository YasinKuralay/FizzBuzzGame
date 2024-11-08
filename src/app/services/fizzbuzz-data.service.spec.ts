import { TestBed } from '@angular/core/testing';

import { FizzbuzzDataService } from './fizzbuzz-data.service';

describe('FizzbuzzDataService', () => {
  let service: FizzbuzzDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FizzbuzzDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
