import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { List } from './list';
import { Payments } from '../../services/payments';
import { Payment } from '../../models/payment';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let service: jasmine.SpyObj<Payments>;
  let router: Router;

  const mockPayments: Payment[] = [
    {
      id_pago: 1,
      fecha_pago: '2024-01-01',
      monto: 100,
      cliente_nombre: 'Juan',
      cliente_apellido: 'Pérez',
      membresia_tipo: 'Premium',
      membresia_precio: 50
    } as Payment,
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('Payments', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Payments, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    service = TestBed.inject(Payments) as jasmine.SpyObj<Payments>;
    router = TestBed.inject(Router);

    service.getAll.and.returnValue(of(mockPayments));
    fixture.detectChanges();
  });

  // TEST BASE
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Carga de pagos al iniciar
  it('should load payments on init', () => {
    expect(service.getAll).toHaveBeenCalled();
    expect(component.payments.length).toBe(1);
    expect(component.payments[0].monto).toBe(100);
  });

  // Navegación a formulario de creación
  it('should navigate to create form', () => {
    const spy = spyOn(router, 'navigate');

    component.navigateToCreate();

    expect(spy).toHaveBeenCalledWith(['/payments/form']);
  });

  // Navegación a formulario de edición
  it('should navigate to edit form', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(1);

    expect(spy).toHaveBeenCalledWith(['/payments/form', 1]);
  });

  // No navega si el id es null
  it('should not navigate to edit form if id is null', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(undefined);

    expect(spy).not.toHaveBeenCalled();
  });

  // Eliminación de pago confirmada
  it('should delete payment when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({} as any));

    component.delete(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.payments.length).toBe(0);
  });

  // Cancelación de eliminación de pago
  it('should not delete payment when confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.delete(1);

    expect(service.delete).not.toHaveBeenCalled();
    expect(component.payments.length).toBe(1);
  });

  // Cancelación de eliminación de pago
  it('payments array should be defined and not null', () => {
    expect(component.payments).toBeDefined();
    expect(component.payments).not.toBeNull();
  });
});
