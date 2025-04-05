import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheEtudiantsComponent } from './affiche-etudiants.component';

describe('AfficheEtudiantsComponent', () => {
  let component: AfficheEtudiantsComponent;
  let fixture: ComponentFixture<AfficheEtudiantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficheEtudiantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
