import { TestBed } from '@angular/core/testing';

import { Trainers } from './trainers';

describe('Trainers', () => {
  let service: Trainers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Trainers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
