import { TestBed } from '@angular/core/testing';

import { Memberships } from './memberships';

describe('Memberships', () => {
  let service: Memberships;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Memberships);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
