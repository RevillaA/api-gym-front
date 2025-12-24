import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { Form } from './form';

describe('Inscription Form Component - Frontend Unit Tests', () => {
  let component: Form;
  let fixture: ComponentFixture<Form>;
  let router: Router;

  // Datos válidos reutilizables
  const validFormData = {
    id_cliente: 1,
    id_clase: 2
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

  // 1. El componente se crea correctamente y comprobamos que se cargo correctamente en la pagina
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // 2. El formulario reactivo se inicializa correctamente
  it('should create the form group', () => {
    expect(component.form).toBeDefined();
    expect(component.form.valid).toBeFalse();
  });

  // 3. El formulario debe ser inválido cuando está vacío
  it('should be invalid when form is empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  // 4. El formulario debe contener los controles requeridos
  it('should contain required form controls', () => {
    expect(component.form.contains('id_cliente')).toBeTrue();
    expect(component.form.contains('id_clase')).toBeTrue();
  });

  // 5. El formulario es válido cuando se selecciona cliente y clase
  it('should be valid when required fields are filled', () => {
    component.form.setValue(validFormData);
    expect(component.form.valid).toBeTrue();
  });

  // 6. Las listas de clientes y clases deben inicializarse como arreglos
  it('should initialize clients and classes arrays', () => {
    expect(component.clients).toBeDefined();
    expect(component.classes).toBeDefined();
    expect(component.clients instanceof Array).toBeTrue();
    expect(component.classes instanceof Array).toBeTrue();
  });

  // 7. El botón Guardar debe estar deshabilitado cuando el formulario es inválido
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    expect(button).toBeTruthy();
    expect(button.disabled).toBeTrue();
  });

  // 8. Al presionar cancelar se debe navegar a /inscriptions
  it('should navigate to /inscriptions when cancel is called', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.cancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/inscriptions']);
  });
  
  // 9. El botón Guardar debe estar deshabilitado cuando el formulario es inválido
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(button).toBeTruthy();
    expect(button.disabled).toBe(true);
  });
});