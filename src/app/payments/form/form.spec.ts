import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Form } from './form';
import { Payments } from '../../services/payments';
import { Clients } from '../../services/clients';
import { Memberships } from '../../services/memberships';
import { Payment } from '../../models/payment';
import { Client } from '../../models/client';
import { Membership } from '../../models/membership';

describe('Payment Form', () => {
  let component: Form;
  let fixture: ComponentFixture<Form>;
  let paymentsService: jasmine.SpyObj<Payments>;
  let clientsService: jasmine.SpyObj<Clients>;
  let membershipsService: jasmine.SpyObj<Memberships>;
  let router: Router;

  const mockClients: Client[] = [
    { id_cliente: 1, nombre: 'Juan', apellido: 'Perez' } as Client,
  ];

  const mockMemberships: Membership[] = [
    { id_membresia: 1, tipo: 'Premium', precio: 50 } as Membership,
  ];

  const mockPayment: Payment = {
    id_cliente: 1,
    id_membresia: 1,
    monto: 50,
  } as Payment;

  beforeEach(async () => {
    paymentsService = jasmine.createSpyObj('Payments', ['getById', 'create', 'update']);
    clientsService = jasmine.createSpyObj('Clients', ['getAll']);
    membershipsService = jasmine.createSpyObj('Memberships', ['getAll']);

    clientsService.getAll.and.returnValue(of(mockClients));
    membershipsService.getAll.and.returnValue(of(mockMemberships));

    await TestBed.configureTestingModule({
      imports: [Form],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Payments, useValue: paymentsService },
        { provide: Clients, useValue: clientsService },
        { provide: Memberships, useValue: membershipsService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Form);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // 1. El componente se crea correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // 2. Los clientes y membresías se cargan correctamente al inicializar
  it('should load clients and memberships on init', () => {
    expect(clientsService.getAll).toHaveBeenCalled();
    expect(membershipsService.getAll).toHaveBeenCalled();
    expect(component.clients.length).toBe(1);
    expect(component.memberships.length).toBe(1);
  });

  // 3. Crear pago con formulario válido
  it('should create payment when form is valid', () => {
    paymentsService.create.and.returnValue(of({} as any));
    const spy = spyOn(router, 'navigate');

    component.form.setValue({
      id_cliente: 1,
      id_membresia: 1,
      monto: 50,
    });

    component.submit();

    expect(paymentsService.create).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(['/payments']);
  });

  // 4. Editar pago correctamente
  it('should update payment when editing', () => {
    component.isEdit = true;
    component.id = 1;
    paymentsService.update.and.returnValue(of({} as any));
    const spy = spyOn(router, 'navigate');

    component.form.setValue({
      id_cliente: 1,
      id_membresia: 1,
      monto: 60,
    });

    component.submit();

    expect(paymentsService.update).toHaveBeenCalledWith(1, {
      id_membresia: 1,
      monto: 60,
    });
    expect(spy).toHaveBeenCalledWith(['/payments']);
  });

  // 5. Cancelar debe navegar a /payments
  it('should navigate back on cancel', () => {
    const spy = spyOn(router, 'navigate');

    component.cancel();

    expect(spy).toHaveBeenCalledWith(['/payments']);
  });

  // 6. Validación del campo monto
  it('should validate monto field correctly', () => {
    const montoControl = component.form.get('monto');

    montoControl?.setValue(-10);
    expect(montoControl?.errors?.['min']).toBeDefined();

    montoControl?.setValue(100);
    expect(montoControl?.value).toEqual(100);
    expect(montoControl?.value).toBeGreaterThan(0);
  });

  // 7. Formulario inválido si algún campo requerido no está definido
  it('should be invalid when required fields are missing', () => {
    component.form.setValue({
      id_cliente: null,
      id_membresia: 1,
      monto: 50,
    });

    expect(component.form.valid).toBeFalse();
  });

  // 8. Formulario válido con todos los campos correctos
  it('should be valid when all required fields are filled', () => {
    component.form.setValue({
      id_cliente: 1,
      id_membresia: 1,
      monto: 50,
    });

    expect(component.form.valid).toBeTrue();
  });
});
