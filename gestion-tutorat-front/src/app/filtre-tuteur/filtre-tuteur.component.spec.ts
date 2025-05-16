import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreTuteurComponent } from './filtre-tuteur.component';

describe('FiltreTuteurComponent', () => {
  let component: FiltreTuteurComponent;
  let fixture: ComponentFixture<FiltreTuteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltreTuteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltreTuteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
