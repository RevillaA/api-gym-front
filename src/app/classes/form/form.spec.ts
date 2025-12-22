import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Form } from './form';

describe('Form', () => {
  let component: Form;
  let fixture: ComponentFixture<Form>;

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
    fixture.detectChanges();
  });

  // TEST ORIGINAL (NO SE TOCA)
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // El formulario se crea
  it('should create the form group', () => {
    expect(component.form).toBeDefined();
    expect(component.form instanceof Object).toBe(true);
  });

  // El formulario es inválido cuando está vacío
  it('should be invalid when form is empty', () => {
    expect(component.form.valid).toBe(false);
  });

  // Controles requeridos existen
  it('should contain required form controls', () => {
    expect(component.form.contains('nombre_clase')).toBe(true);
    expect(component.form.contains('horario')).toBe(true);
    expect(component.form.contains('dia_semana')).toBe(true);
  });

  // Formulario válido con datos correctos
  it('should be valid when required fields are filled', () => {
    component.form.setValue({
      nombre_clase: 'Yoga',
      descripcion: 'Clase de relajación',
      horario: '08:00',
      dia_semana: 'Lunes',
      id_entrenador: null
    });

    expect(component.form.valid).toBe(true);
  });

  // Botón deshabilitado cuando el formulario es inválido
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  // Días válidos definidos
  it('should have valid days list', () => {
    expect(component.validDays.length).toBeGreaterThan(0);
    expect(component.validDays).toContain('Lunes');
  });
});
