import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Clients } from './clients';

describe('Clients', () => {
  let service: Clients;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Clients);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
