import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Inscriptions } from './inscriptions';

describe('Inscriptions', () => {
  let service: Inscriptions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Inscriptions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
