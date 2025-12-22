import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Trainers } from './trainers';

describe('Trainers', () => {
  let service: Trainers;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Trainers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
