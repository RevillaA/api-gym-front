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
    expect(component.form.contains('id_cliente')).toBe(true);
    expect(component.form.contains('id_clase')).toBe(true);
  });

  // Formulario válido con datos correctos
  it('should be valid when required fields are filled', () => {
    component.form.setValue({
      id_cliente: 1,
      id_clase: 2
    });

    expect(component.form.valid).toBe(true);
  });

  // Botón deshabilitado cuando el formulario es inválido
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(button).toBeTruthy();
    expect(button.disabled).toBe(true);
  });
});
