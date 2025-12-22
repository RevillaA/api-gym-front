import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Memberships } from './memberships';
import { environment } from '../../environments/environment';
import { Membership } from '../models/membership';

describe('Memberships Service', () => {
  let service: Memberships;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/memberships`;

  const mockMembership: Membership = {
    id_membresia: 1,
    tipo: 'Premium',
    precio: 50,
    duracion_meses: 6,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(Memberships);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ========================
  // CREACIÓN DEL SERVICIO
  // ========================
  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service).toBeDefined();
  });

  // ========================
  // GET ALL
  // ========================
  it('should get all memberships', () => {
    service.getAll().subscribe(memberships => {
      expect(memberships).toBeTruthy();
      expect(memberships.length).toBeGreaterThan(0);
      expect(memberships[0].tipo).toBe('Premium');
      expect(memberships[0].precio).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush([mockMembership]);
  });

  // ========================
  // GET BY ID
  // ========================
  it('should get membership by id', () => {
    service.getById(1).subscribe(membership => {
      expect(membership).toBeTruthy();
      expect(membership.id_membresia).toBe(1);
      expect(membership.duracion_meses).toEqual(6);
      expect(membership.tipo).not.toBe('');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockMembership);
  });

  // ========================
  // CREATE
  // ========================
  it('should create a membership', () => {
    const createPayload: Membership = {
      tipo: 'Basic',
      precio: 20,
      duracion_meses: 3,
    };

    service.create(createPayload).subscribe(membership => {
      expect(membership).toBeDefined();
      expect(membership.tipo).toBe('Premium');
      expect(membership.id_membresia).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.tipo).toBe('Basic');
    expect(req.request.body.precio).toBe(20);

    req.flush(mockMembership);
  });

  // ========================
  // UPDATE
  // ========================
  it('should update a membership', () => {
    const updatePayload: Membership = {
      tipo: 'Gold',
      precio: 70,
      duracion_meses: 12,
    };

    service.update(1, updatePayload).subscribe(membership => {
      expect(membership.tipo).toBe('Gold');
      expect(membership.precio).toBe(70);
      expect(membership.duracion_meses).toBeGreaterThan(6);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.tipo).toBe('Gold');

    req.flush({ ...updatePayload, id_membresia: 1 });
  });

  // ========================
  // DELETE
  // ========================
  it('should delete a membership', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
