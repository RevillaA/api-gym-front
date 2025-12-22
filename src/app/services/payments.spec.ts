import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Payments } from './payments';

describe('Payments', () => {
  let service: Payments;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Payments);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
