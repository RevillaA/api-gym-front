import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Classes } from './classes';
import { environment } from '../../environments/environment';
import { Class } from '../models/class';

describe('Classes Service', () => {
  let service: Classes;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/classes`;

  const mockClasses: Class[] = [
    {
      id_clase: 1,
      nombre_clase: 'Yoga',
      descripcion: 'Clase de relajación',
      horario: '08:00',
      dia_semana: 'Lunes',
      id_entrenador: 10
    },
    {
      id_clase: 2,
      nombre_clase: 'Crossfit',
      descripcion: 'Alta intensidad',
      horario: '18:00',
      dia_semana: 'Martes',
      id_entrenador: 12
    }
  ];

  const mockClass: Class = {
    id_clase: 1,
    nombre_clase: 'Yoga',
    descripcion: 'Clase de relajación',
    horario: '08:00',
    dia_semana: 'Lunes',
    id_entrenador: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Classes]
    });

    service = TestBed.inject(Classes);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all classes', () => {
    service.getAll().subscribe(classes => {
      expect(classes).toBeTruthy();
      expect(classes.length).toBe(2);
      expect(classes.length).toBeGreaterThan(1);
      expect(classes[0].nombre_clase).toBe('Yoga');
      expect(classes[1].dia_semana).toContain('Martes');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockClasses);
  });

  it('should get class by id', () => {
    service.getById(1).subscribe(clase => {
      expect(clase).toBeTruthy();
      expect(clase.id_clase).toBe(1);
      expect(clase.nombre_clase).toEqual('Yoga');
      expect(clase.horario).toMatch(/\d{2}:\d{2}/);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockClass);
  });

  it('should create a new class', () => {
    service.create(mockClass).subscribe(clase => {
      expect(clase).toBeTruthy();
      expect(clase.nombre_clase).toBe('Yoga');
      expect(clase.dia_semana).toBeDefined();
      expect(clase.id_entrenador).toBe(10);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockClass);

    req.flush(mockClass);
  });

  it('should update a class', () => {
    const updateData: Partial<Class> = {
      nombre_clase: 'Yoga Avanzado',
      horario: '09:00'
    };

    service.update(1, updateData).subscribe(clase => {
      expect(clase).toBeTruthy();
      expect(clase.nombre_clase).toBe('Yoga Avanzado');
      expect(clase.horario).toBe('09:00');
      expect(clase.id_clase).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);

    req.flush({ ...mockClass, ...updateData });
  });

  it('should delete a class', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});