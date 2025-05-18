import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheUtilisateursComponent } from './affiche-utilisateurs.component';

describe('ListeUtilisateursComponent', () => {
  let component: AfficheUtilisateursComponent;
  let fixture: ComponentFixture<AfficheUtilisateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficheUtilisateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
