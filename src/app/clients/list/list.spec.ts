import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { List } from './list';
import { Clients } from '../../services/clients';
import { Client } from '../../models/client';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let service: jasmine.SpyObj<Clients>;
  let router: Router;

  const mockClients: Client[] = [
    {
      id_cliente: 1,
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@test.com',
      telefono: '0999999999',
      fecha_nacimiento: '2000-01-01',
    } as Client,
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('Clients', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Clients, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    service = TestBed.inject(Clients) as jasmine.SpyObj<Clients>;
    router = TestBed.inject(Router);

    service.getAll.and.returnValue(of(mockClients));
    fixture.detectChanges();
  });

  // TEST ORIGINAL
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Carga de clientes al iniciar
  it('should load clients on init', () => {
    expect(service.getAll).toHaveBeenCalled();
    expect(component.clients.length).toBe(1);
    expect(component.clients[0].nombre).toBe('Juan');
  });

  // Navegación a formulario de creación
  it('should navigate to create form', () => {
    const spy = spyOn(router, 'navigate');

    component.navigateToCreate();

    expect(spy).toHaveBeenCalledWith(['/clients/form']);
  });

  // Navegación a formulario de edición
  it('should navigate to edit form', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(1);

    expect(spy).toHaveBeenCalledWith(['/clients/form', 1]);
  });

  // No navega si el id es null
  it('should not navigate to edit form if id is null', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(undefined);

    expect(spy).not.toHaveBeenCalled();
  });

  // Eliminación de cliente confirmada
  it('should delete client when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({} as any));

    component.delete(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.clients.length).toBe(0);
  });
});
