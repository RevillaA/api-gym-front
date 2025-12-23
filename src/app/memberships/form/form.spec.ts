import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Form } from './form';

describe('Membership Form', () => {
  let component: Form;
  let fixture: ComponentFixture<Form>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Form);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  // 1. El componente se crea correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // 2. El formulario reactivo se inicializa correctamente
  it('should create the form group', () => {
    expect(component.form).toBeDefined();
    expect(component.form instanceof Object).toBeTrue();
  });

  // 3. El formulario debe ser inválido cuando está vacío
  it('should be invalid when form is empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  // 4. El formulario debe contener los controles requeridos
  it('should contain required form controls', () => {
    expect(component.form.contains('tipo')).toBeTrue();
    expect(component.form.contains('precio')).toBeTrue();
    expect(component.form.contains('duracion_meses')).toBeTrue();
  });

  // 5. El formulario debe ser inválido si el precio es negativo
  it('should be invalid when precio is negative', () => {
    component.form.setValue({
      tipo: 'Básica',
      precio: -10,
      duracion_meses: 3
    });

    expect(component.form.valid).toBeFalse();
  });

  // 6. El formulario debe ser inválido si la duración es menor a 1
  it('should be invalid when duracion_meses is less than 1', () => {
    component.form.setValue({
      tipo: 'Premium',
      precio: 50,
      duracion_meses: 0
    });

    expect(component.form.valid).toBeFalse();
  });

  // 7. El formulario es válido cuando se completan los campos requeridos
  it('should be valid when all required fields are filled correctly', () => {
    component.form.setValue({
      tipo: 'Premium',
      precio: 80,
      duracion_meses: 12
    });

    expect(component.form.valid).toBeTrue();
  });

  // 8. El botón Guardar debe estar deshabilitado cuando el formulario es inválido
  it('should disable submit button when form is invalid', () => {
    const button = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    expect(button).toBeTruthy();
    expect(button.disabled).toBeTrue();
  });
});
