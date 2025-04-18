import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuteurCreateComponent } from './tuteur-create.component';

describe('TuteurCreateComponent', () => {
  let component: TuteurCreateComponent;
  let fixture: ComponentFixture<TuteurCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuteurCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuteurCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
