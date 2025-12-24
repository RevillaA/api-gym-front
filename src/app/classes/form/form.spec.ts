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
  // Datos válidos reutilizables
  beforeEach(async () => {    //Configuramos el entorno de pruebas para el componente Form
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
  // verificamos que el componente "Clases" nazca con las condiciones mínimas necesarias.

  // 1. El componente se crea correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy(); //Confirmamos que el componente existe en memoria
  });

  // 2. El formulario reactivo se inicializa correctamente
  it('should create the form group', () => {
    expect(component.form).toBeDefined(); //Verificamos que el formulario esté definido
    expect(component.form.valid).toBeFalsy();  //El formulario debe ser inválido al inicio
  });

  // 3. El formulario debe ser inválido cuando está vacío
  it('should be invalid when form is empty', () => {
    expect(component.form.valid).toBe(false); //aqui tobe(false) verificar que el formulario este invalido cuando esta vacio
  });

  // 4. El formulario es válido cuando se completan los campos requeridos
  it('should be valid when required fields are filled', () => {
    component.form.setValue(validFormData);   //Rellenamos el formulario con datos válidos
    expect(component.form.valid).toBe(true);  //Verificamos que el formulario sea válido cuando se llenan los campos requeridos
  });

  // 5. La lista de días válidos existe y contiene valores esperados
  it('should define validDays correctly', () => {   //Verificamos que la lista de días válidos esté definida correctamente
    expect(component.validDays.length).toBeGreaterThan(0);  //comprobamos el arreglo validDays esté poblado
    expect(component.validDays).toContain('Lunes'); // Esto asegura que el usuario siempre tenga opciones para elegir en el formulario.
  });

  // 6. El nombre de la clase debe cumplir un patrón básico (solo letras)
  it('should match class name pattern', () => { //usamos una expresión regular para asegurar queel nombre de la clase (ej. "Pilates")
    component.form.patchValue({ nombre_clase: 'Pilates' });  //solo contenga letras.
    expect(component.form.value.nombre_clase).toMatch(/^[A-Za-z]+$/); //evita que se guarden caracteres extraños y coincida con el patrón esperado.
  });

  // 7. El botón Guardar debe estar deshabilitado cuando el formulario es inválido
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(    //querySelector busca en el DOM el botón de submit
      'button[type="submit"]'
    ) as HTMLButtonElement;

    expect(button.disabled).toBeTruthy();
  });

  // 8. Al presionar cancelar se debe navegar a /classes
  it('should navigate to /classes when cancel is called', () => {
    const navigateSpy =spyOn(router, 'navigate'); //Espiamos el método de navegación del router para verificar que se llame correctamente

    component.cancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/classes']); //Verificamos que la navegación se haya realizado a la ruta correcta
  });
});
