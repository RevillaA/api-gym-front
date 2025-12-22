import { TestBed } from '@angular/core/testing';

import { Inscriptions } from './inscriptions';

describe('Inscriptions', () => {
  let service: Inscriptions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Inscriptions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
