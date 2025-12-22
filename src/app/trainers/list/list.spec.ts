import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { List } from './list';
import { Trainers } from '../../services/trainers';
import { Trainer } from '../../models/trainer';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let service: jasmine.SpyObj<Trainers>;
  let router: Router;

  const mockTrainers: Trainer[] = [
    {
      id_entrenador: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      telefono: '0999999999',
      especialidad: 'Cardio',
    } as Trainer,
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('Trainers', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Trainers, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    service = TestBed.inject(Trainers) as jasmine.SpyObj<Trainers>;
    router = TestBed.inject(Router);

    service.getAll.and.returnValue(of(mockTrainers));

    fixture.detectChanges();
  });

  // TEST ORIGINAL
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Carga de entrenadores al iniciar
  it('should load trainers on init', () => {
    expect(service.getAll).toHaveBeenCalled();
    expect(component.trainers.length).toBe(1);
    expect(component.trainers[0].nombre).toBe('Juan');
  });

  // Navegación a formulario de creación
  it('should navigate to create form', () => {
    const spy = spyOn(router, 'navigate');

    component.navigateToCreate();

    expect(spy).toHaveBeenCalledWith(['/trainers/form']);
  });

  // Navegación a formulario de edición
  it('should navigate to edit form', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(1);

    expect(spy).toHaveBeenCalledWith(['/trainers/form', 1]);
  });

  // No navega si el id es null
  it('should not navigate to edit form if id is null', () => {
    const spy = spyOn(router, 'navigate');

    component.edit(undefined);

    expect(spy).not.toHaveBeenCalled();
  });

  // Eliminación de entrenador confirmada
  it('should delete trainer when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({} as any));

    component.delete(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.trainers.length).toBe(0);
  });

  // No elimina si se cancela confirmación
  it('should not delete trainer if confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.delete(1);

    expect(service.delete).not.toHaveBeenCalled();
    expect(component.trainers.length).toBe(1);
  });

  // Método delete no falla sin id
  it('should not throw error when delete is called without id', () => {
    expect(() => component.delete(undefined)).not.toThrow();
  });
});
