import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuteurEditComponent } from './tuteur-edit.component';

describe('TuteurEditComponent', () => {
  let component: TuteurEditComponent;
  let fixture: ComponentFixture<TuteurEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuteurEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuteurEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
