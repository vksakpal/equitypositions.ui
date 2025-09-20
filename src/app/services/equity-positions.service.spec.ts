import { TestBed } from '@angular/core/testing';

import { EquityPositionsService } from './equity-positions.service';

describe('EquityPositionsService', () => {
  let service: EquityPositionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquityPositionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
