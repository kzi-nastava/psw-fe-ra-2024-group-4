import { TestBed } from '@angular/core/testing';

import { TourOverviewService } from './tour-overview.service';

describe('TourOverviewService', () => {
  let service: TourOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
