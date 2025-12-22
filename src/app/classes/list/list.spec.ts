import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { List } from './list';
import { Classes } from '../../services/classes';
import { Class } from '../../models/class';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let service: jasmine.SpyObj<Classes>;
  let router: Router;

  const mockClasses: Class[] = [
    {
      id_clase: 1,
      nombre_clase: 'Yoga',
      descripcion: 'Relajación',
      horario: '08:00',
      dia_semana: 'Lunes',
      entrenador_nombre: 'Ana',
      entrenador_apellido: 'Pérez',
    } as Class,
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('Classes', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Classes, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    service = TestBed.inject(Classes) as jasmine.SpyObj<Classes>;
    router = TestBed.inject(Router);

    service.getAll.and.returnValue(of(mockClasses));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load classes on init', () => {
    expect(service.getAll).toHaveBeenCalled();
    expect(component.classes.length).toBe(1);
    expect(component.classes[0].nombre_clase).toBe('Yoga');
  });

  it('should navigate to create form', () => {
    const spy = spyOn(router, 'navigate');
    component.navigateToCreate();
    expect(spy).toHaveBeenCalledWith(['/classes/form']);
  });

  it('should navigate to edit form', () => {
    const spy = spyOn(router, 'navigate');
    component.edit(1);
    expect(spy).toHaveBeenCalledWith(['/classes/form', 1]);
  });

  it('should delete class when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({} as any));

    component.delete(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.classes.length).toBe(0);
  });
});
