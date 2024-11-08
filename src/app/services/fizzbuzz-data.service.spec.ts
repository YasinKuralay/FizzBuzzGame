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

  it('should start emitting items on interval', (done) => {
    service.startEmittingItemsOnInterval();
    expect(service['fizzbuzzTimerSubscription']).toBeDefined();
    setTimeout(() => {
      expect(service['internalFizzbuzzList'].length).toBeGreaterThan(0);
      service.stopEmittingItemsOnInterval();
      done();
    }, 600);
  });

  it('should stop emitting items on interval', () => {
    service.startEmittingItemsOnInterval();
    service.stopEmittingItemsOnInterval();
    expect(service['fizzbuzzTimerSubscription']).toBeUndefined();
  });

  it('should reset Fizzbuzz list', () => {
    service.startEmittingItemsOnInterval();
    service.resetFizzbuzzList();
    expect(service['internalFizzbuzzList']).toEqual([]);
    expect(service['currentNumberOfList']).toBe(1);
  });

  it('should calculate and emit next item correctly', () => {
    service['currentNumberOfList'] = 1;
    service['calculateAndEmitNextItem']();
    expect(service['internalFizzbuzzList'][0].value).toBe('1');

    service['currentNumberOfList'] = 3;
    service['calculateAndEmitNextItem']();
    expect(service['internalFizzbuzzList'][1].value).toBe('Fizz');

    service['currentNumberOfList'] = 5;
    service['calculateAndEmitNextItem']();
    expect(service['internalFizzbuzzList'][2].value).toBe('Buzz');

    service['currentNumberOfList'] = 15;
    service['calculateAndEmitNextItem']();
    expect(service['internalFizzbuzzList'][3].value).toBe('FizzBuzz');
  });

  it('should generate unique ID', () => {
    const id1 = service['generateUniqueId'](1);
    const id2 = service['generateUniqueId'](1);
    expect(id1).not.toEqual(id2);
  });
});
