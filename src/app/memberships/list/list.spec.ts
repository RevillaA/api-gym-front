import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { List } from './list';
import { Memberships } from '../../services/memberships';
import { Membership } from '../../models/membership';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let service: jasmine.SpyObj<Memberships>;
  let router: Router;

  const mockMemberships: Membership[] = [
    {
      id_membresia: 1,
      tipo: 'Premium',
      precio: 50,
      duracion_meses: 6
    } as Membership,
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('Memberships', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Memberships, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    service = TestBed.inject(Memberships) as jasmine.SpyObj<Memberships>;
    router = TestBed.inject(Router);

    service.getAll.and.returnValue(of(mockMemberships));
    fixture.detectChanges();
  });

  // TEST ORIGINAL
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Carga de membresías al iniciar
  it('should load memberships on init', () => {
    expect(service.getAll).toHaveBeenCalled();
    expect(component.memberships.length).toBe(1);
    expect(component.memberships[0].tipo).toBe('Premium');
  });

  // Navegación a formulario de creación
  it('should navigate to create form', () => {
    const spy = spyOn(router, 'navigate');

    component.navigateToCreate();

    expect(spy).toHaveBeenCalledWith(['/memberships/form']);
  });

  // Navegación a formulario de edición
  it('should navigate to edit form', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(1);

    expect(spy).toHaveBeenCalledWith(['/memberships/form', 1]);
  });

  // No navega si el id es null
  it('should not navigate to edit form if id is null', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(undefined);

    expect(spy).not.toHaveBeenCalled();
  });

  // Eliminación de membresía confirmada
  it('should delete membership when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({} as any));

    component.delete(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.memberships.length).toBe(0);
  });
});
