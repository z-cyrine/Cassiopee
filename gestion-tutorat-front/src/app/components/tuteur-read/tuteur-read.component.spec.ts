import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuteurReadComponent } from './tuteur-read.component';

describe('TuteurReadComponent', () => {
  let component: TuteurReadComponent;
  let fixture: ComponentFixture<TuteurReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuteurReadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuteurReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
