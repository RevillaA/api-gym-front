import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Inscriptions } from './inscriptions';
import { environment } from '../../environments/environment';
import { Inscription } from '../models/inscription';

describe('Inscriptions Service', () => {
  let service: Inscriptions;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/inscriptions`;

  const mockInscription: Inscription = {
    id_inscripcion: 1,
    id_cliente: 10,
    id_clase: 5,
    fecha_inscripcion: '2025-01-10',
    cliente_nombre: 'Ana',
    cliente_apellido: 'Lopez',
    nombre_clase: 'Yoga',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(Inscriptions);
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
  it('should get all inscriptions', () => {
    service.getAll().subscribe(inscriptions => {
      expect(inscriptions).toBeTruthy();
      expect(inscriptions.length).toBeGreaterThan(0);
      expect(inscriptions[0].id_cliente).toBe(10);
      expect(inscriptions[0].nombre_clase).toBe('Yoga');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush([mockInscription]);
  });

  // ========================
  // GET BY ID
  // ========================
  it('should get inscription by id', () => {
    service.getById(1).subscribe(inscription => {
      expect(inscription).toBeTruthy();
      expect(inscription.id_inscripcion).toBe(1);
      expect(inscription.id_clase).toEqual(5);
      expect(inscription.cliente_nombre).not.toBe('');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockInscription);
  });

  // ========================
  // CREATE
  // ========================
  it('should create an inscription', () => {
    const createPayload = {
      id_cliente: 10,
      id_clase: 5,
    };

    service.create(createPayload).subscribe(inscription => {
      expect(inscription).toBeDefined();
      expect(inscription.id_cliente).toBe(10);
      expect(inscription.id_clase).toBe(5);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_cliente).toBe(10);
    expect(req.request.body.id_clase).toBe(5);

    req.flush(mockInscription);
  });

  // ========================
  // UPDATE
  // ========================
  it('should update inscription class', () => {
    service.update(1, 8).subscribe(inscription => {
      expect(inscription.id_clase).toBe(8);
      expect(inscription.id_clase).not.toBe(5);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.id_clase).toBe(8);

    req.flush({ ...mockInscription, id_clase: 8 });
  });

  // ========================
  // DELETE
  // ========================
  it('should delete an inscription', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
