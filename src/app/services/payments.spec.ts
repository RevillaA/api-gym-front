import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Payments } from './payments';
import { environment } from '../../environments/environment';
import { Payment } from '../models/payment';

describe('Payments Service', () => {
  let service: Payments;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/payments`;

  const mockPayment: Payment = {
    id_pago: 1,
    id_cliente: 10,
    id_membresia: 3,
    monto: 45,
    fecha_pago: '2025-01-01',
    cliente_nombre: 'Juan',
    cliente_apellido: 'Perez',
    membresia_tipo: 'Premium',
    membresia_precio: 50,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(Payments);
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
  it('should get all payments', () => {
    service.getAll().subscribe(payments => {
      expect(payments).toBeTruthy();
      expect(payments.length).toBeGreaterThan(0);
      expect(payments[0].monto).toBeGreaterThan(0);
      expect(payments[0].cliente_nombre).toBe('Juan');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush([mockPayment]);
  });

  // ========================
  // GET BY ID
  // ========================
  it('should get payment by id', () => {
    service.getById(1).subscribe(payment => {
      expect(payment).toBeTruthy();
      expect(payment.id_pago).toBe(1);
      expect(payment.id_cliente).toEqual(10);
      expect(payment.monto).toBe(45);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockPayment);
  });

  // ========================
  // CREATE
  // ========================
  it('should create a payment', () => {
    const createPayload: Pick<Payment, 'id_cliente' | 'id_membresia' | 'monto'> = {
      id_cliente: 10,
      id_membresia: 3,
      monto: 45,
    };

    service.create(createPayload).subscribe(payment => {
      expect(payment).toBeDefined();
      expect(payment.id_pago).toBeGreaterThan(0);
      expect(payment.monto).toBe(45);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_cliente).toBe(10);
    expect(req.request.body.monto).toEqual(45);

    req.flush(mockPayment);
  });

  // ========================
  // UPDATE
  // ========================
  it('should update a payment', () => {
    const updatePayload = {
      id_membresia: 4,
      monto: 60,
    };

    service.update(1, updatePayload).subscribe(payment => {
      expect(payment.id_membresia).toBe(4);
      expect(payment.monto).toBeGreaterThan(50);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.id_membresia).toBe(4);

    req.flush({ ...mockPayment, ...updatePayload });
  });

  // ========================
  // DELETE
  // ========================
  it('should delete a payment', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
