import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { Form } from './form';

describe('Form Component - Frontend Unit Tests', () => {
  let component: Form;
  let fixture: ComponentFixture<Form>;
  let router: Router;

  // Datos reutilizables para evitar código duplicado
  const validFormData = {
    nombre_clase: 'Yoga',
    descripcion: 'Clase de relajación',
    horario: '08:00',
    dia_semana: 'Lunes',
    id_entrenador: null
  };

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
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // 1. El componente se crea correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // 2. El formulario reactivo se inicializa correctamente
  it('should create the form group', () => {
    expect(component.form).toBeDefined();
    expect(component.form.valid).toBeFalsy();
  });

  // 3. El formulario debe ser inválido cuando está vacío
  it('should be invalid when form is empty', () => {
    expect(component.form.valid).toBe(false);
  });

  // 4. El formulario es válido cuando se completan los campos requeridos
  it('should be valid when required fields are filled', () => {
    component.form.setValue(validFormData);
    expect(component.form.valid).toBe(true);
  });

  // 5. La lista de días válidos existe y contiene valores esperados
  it('should define validDays correctly', () => {
    expect(component.validDays.length).toBeGreaterThan(0);
    expect(component.validDays).toContain('Lunes');
  });

  // 6. El nombre de la clase debe cumplir un patrón básico (solo letras)
  it('should match class name pattern', () => {
    component.form.patchValue({ nombre_clase: 'Pilates' });
    expect(component.form.value.nombre_clase).toMatch(/^[A-Za-z]+$/);
  });

  // 7. El botón Guardar debe estar deshabilitado cuando el formulario es inválido
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    expect(button.disabled).toBeTruthy();
  });

  // 8. Al presionar cancelar se debe navegar a /classes
  it('should navigate to /classes when cancel is called', () => {
    const navigateSpy =spyOn(router, 'navigate');

    component.cancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/classes']);
  });
});
