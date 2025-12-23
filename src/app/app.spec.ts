import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();
  });

  // Verifica que el componente principal de la aplicación se cree correctamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Comprobamos que el componente existe
  });

  // Comprueba que la marca del navbar se renderiza con el texto correcto
  it('should render navbar brand', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges(); 
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.navbar-brand')?.textContent).toContain('Gym'); 
  });

  // Asegura que el router-outlet esté presente en el DOM
  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('router-outlet')).toBeTruthy(); 
  });

  // Comprueba que los links de navegación estén presentes
  it('should render all navbar links', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const links = compiled.querySelectorAll('.nav-link');
    expect(links.length).toBeGreaterThan(0); // Debe haber al menos un link de navegación
  });

  // Comprueba que la propiedad interna 'title' del componente esté definida
  it('should have title signal defined', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app['title']).toBeDefined(); // Verifica que 'title' exista en el componente
  });  
});