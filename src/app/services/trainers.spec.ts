import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Trainers } from './trainers';
import { environment } from '../../environments/environment';
import { Trainer } from '../models/trainer';

describe('Trainers Service', () => {
  let service: Trainers;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/trainers`;

  const mockTrainer: Trainer = {
    id_entrenador: 1,
    nombre: 'Carlos',
    apellido: 'Lopez',
    email: 'carlos@correo.com',
    telefono: '0999999999',
    especialidad: 'Fitness',
    fecha_contratacion: '2024-01-10',
    estado: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(Trainers);
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
  it('should get all trainers', () => {
    service.getAll().subscribe(trainers => {
      expect(trainers).toBeTruthy();
      expect(trainers.length).toBeGreaterThan(0);
      expect(trainers[0].especialidad).toBe('Fitness');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush([mockTrainer]);
  });

  // ========================
  // GET BY ID
  // ========================
  it('should get trainer by id', () => {
    service.getById(1).subscribe(trainer => {
      expect(trainer).toBeTruthy();
      expect(trainer.id_entrenador).toBe(1);
      expect(trainer.nombre).toEqual('Carlos');
      expect(trainer.estado).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTrainer);
  });

  // ========================
  // CREATE
  // ========================
  it('should create a trainer', () => {
    const createPayload: Trainer = {
      nombre: 'Carlos',
      apellido: 'Lopez',
      email: 'carlos@correo.com',
      telefono: '0999999999',
      especialidad: 'Fitness',
      fecha_contratacion: '2024-01-10',
    };

    service.create(createPayload).subscribe(trainer => {
      expect(trainer).toBeDefined();
      expect(trainer.id_entrenador).toBeGreaterThan(0);
      expect(trainer.email).toContain('@');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.nombre).toBe('Carlos');

    req.flush(mockTrainer);
  });

  // ========================
  // UPDATE
  // ========================
  it('should update a trainer', () => {
    const updatePayload: Trainer = {
      ...mockTrainer,
      especialidad: 'Crossfit',
    };

    service.update(1, updatePayload).subscribe(trainer => {
      expect(trainer.especialidad).toBe('Crossfit');
      expect(trainer.nombre).toBe('Carlos');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.especialidad).toBe('Crossfit');

    req.flush(updatePayload);
  });

  // ========================
  // DELETE
  // ========================
  it('should delete a trainer', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
