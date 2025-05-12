import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreEtudiantsComponent } from './filtre-etudiants.component';

describe('FiltreEtudiantsComponent', () => {
  let component: FiltreEtudiantsComponent;
  let fixture: ComponentFixture<FiltreEtudiantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltreEtudiantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltreEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
