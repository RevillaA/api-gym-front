import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { Form } from './form';
import { Trainers } from '../../services/trainers';
import { Trainer } from '../../models/trainer';

describe('Form', () => {
  let component: Form;
  let fixture: ComponentFixture<Form>;
  let service: jasmine.SpyObj<Trainers>;
  let router: Router;

  const mockTrainer: Trainer = {
    id_entrenador: 1,
    nombre: 'Carlos',
    apellido: 'Gómez',
    email: 'carlos@test.com',
    telefono: '0999999999',
    especialidad: 'Fuerza',
    fecha_contratacion: '2024-01-01',
  } as Trainer;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('Trainers', [
      'getById',
      'create',
      'update',
    ]);

    await TestBed.configureTestingModule({
      imports: [Form],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Trainers, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Form);
    component = fixture.componentInstance;
    service = TestBed.inject(Trainers) as jasmine.SpyObj<Trainers>;
    router = TestBed.inject(Router);

    service.getById.and.returnValue(of(mockTrainer));
    service.create.and.returnValue(of({} as any));
    service.update.and.returnValue(of({} as any));

    fixture.detectChanges();
  });

  // TEST BASE
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Formulario creado correctamente
  it('should create the form group', () => {
    expect(component.form).toBeDefined();
    expect(component.form.valid).toBeFalse();
  });

  // Controles requeridos existen
  it('should contain required form controls', () => {
    expect(component.form.contains('nombre')).toBeTrue();
    expect(component.form.contains('apellido')).toBeTrue();
    expect(component.form.contains('email')).toBeTrue();
    expect(component.form.contains('telefono')).toBeTrue();
    expect(component.form.contains('especialidad')).toBeTrue();
    expect(component.form.contains('fecha_contratacion')).toBeTrue();
  });

  // Formulario válido con datos correctos
  it('should be valid when form is filled correctly', () => {
    component.form.setValue({
      nombre: 'Carlos',
      apellido: 'Gómez',
      email: 'carlos@test.com',
      telefono: '0999999999',
      especialidad: 'Fuerza',
      fecha_contratacion: '2024-01-01',
    });

    expect(component.form.valid).toBeTrue();
  });

  // Crear entrenador cuando no es edición
  it('should call create when submitting in create mode', () => {
    const spy = spyOn(router, 'navigate');

    component.form.setValue({
      nombre: 'Carlos',
      apellido: 'Gómez',
      email: 'carlos@test.com',
      telefono: '0999999999',
      especialidad: 'Fuerza',
      fecha_contratacion: '2024-01-01',
    });

    component.submit();

    expect(service.create).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(['/trainers']);
  });

  // Cancelar navegación
  it('should navigate back on cancel', () => {
    const spy = spyOn(router, 'navigate');

    component.cancel();

    expect(spy).toHaveBeenCalledWith(['/trainers']);
  });

  // Validaciones
  it('should not submit if form is invalid', () => {
    component.form.reset();

    component.submit();

    expect(service.create).not.toHaveBeenCalled();
    expect(service.update).not.toHaveBeenCalled();
  });

  // Validaciones
  it('email control should be invalid with wrong format', () => {
    const emailControl = component.form.get('email');

    emailControl?.setValue('correo-invalido');

    expect(emailControl?.valid).toBeFalse();
  });
});
