import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { List } from './list';
import { Inscriptions } from '../../services/inscriptions';
import { Inscription } from '../../models/inscription';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let service: jasmine.SpyObj<Inscriptions>;
  let router: Router;

  const mockInscriptions: Inscription[] = [
    {
      id_inscripcion: 1,
      fecha_inscripcion: '2025-01-01',
      cliente_nombre: 'Juan',
      cliente_apellido: 'Perez',
      nombre_clase: 'Yoga'
    } as Inscription,
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('Inscriptions', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Inscriptions, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    service = TestBed.inject(Inscriptions) as jasmine.SpyObj<Inscriptions>;
    router = TestBed.inject(Router);

    service.getAll.and.returnValue(of(mockInscriptions));
    fixture.detectChanges();
  });

  // TEST ORIGINAL
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Carga de inscripciones al iniciar
  it('should load inscriptions on init', () => {
    expect(service.getAll).toHaveBeenCalled();
    expect(component.inscriptions.length).toBe(1);
    expect(component.inscriptions[0].nombre_clase).toBe('Yoga');
  });

  // Navegación a formulario de creación
  it('should navigate to create form', () => {
    const spy = spyOn(router, 'navigate');

    component.navigateToCreate();

    expect(spy).toHaveBeenCalledWith(['/inscriptions/form']);
  });

  // Navegación a formulario de edición
  it('should navigate to edit form', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(1);

    expect(spy).toHaveBeenCalledWith(['/inscriptions/form', 1]);
  });

  // No navega si el id es null
  it('should not navigate to edit form if id is null', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(undefined);

    expect(spy).not.toHaveBeenCalled();
  });

  // Eliminación de inscripción confirmada
  it('should delete inscription when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({} as any));

    component.delete(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.inscriptions.length).toBe(0);
  });
});
