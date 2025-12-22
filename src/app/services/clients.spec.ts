import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Clients } from './clients';
import { environment } from '../../environments/environment';
import { Client } from '../models/client';

describe('Clients Service', () => {
  let service: Clients;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/clients`;

  const mockClient: Client = {
    id_cliente: 1,
    nombre: 'Juan',
    apellido: 'Perez',
    fecha_nacimiento: '1995-05-10',
    email: 'juan@test.com',
    telefono: '0999999999',
    estado: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(Clients);
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
  it('should get all clients', () => {
    service.getAll().subscribe(clients => {
      expect(clients).toBeTruthy();
      expect(clients.length).toBeGreaterThan(0);
      expect(clients[0].nombre).toBe('Juan');
      expect(clients[0].email).toContain('@');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush([mockClient]);
  });

  // ========================
  // GET BY ID
  // ========================
  it('should get client by id', () => {
    service.getById(1).subscribe(client => {
      expect(client).toBeTruthy();
      expect(client.id_cliente).toBe(1);
      expect(client.nombre).toEqual('Juan');
      expect(client.apellido).not.toBe('');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockClient);
  });

  // ========================
  // CREATE
  // ========================
  it('should create a client', () => {
    service.create(mockClient).subscribe(client => {
      expect(client).toBeDefined();
      expect(client.nombre).toBe('Juan');
      expect(client.id_cliente).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.nombre).toBe('Juan');

    req.flush(mockClient);
  });

  // ========================
  // UPDATE
  // ========================
  it('should update a client', () => {
    const updatedClient: Client = {
      ...mockClient,
      nombre: 'Carlos',
    };

    service.update(1, updatedClient).subscribe(client => {
      expect(client.nombre).toBe('Carlos');
      expect(client.nombre).not.toBe('Juan');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.nombre).toBe('Carlos');

    req.flush(updatedClient);
  });

  // ========================
  // DELETE
  // ========================
  it('should delete a client', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
