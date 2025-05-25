import { TestBed } from '@angular/core/testing';

import { UbungDataService } from './ubung-data.service';

describe('UbungDataService', () => {
  let service: UbungDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbungDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
