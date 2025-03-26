import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAffectationComponent } from './auto-affectation.component';

describe('AutoAffectationComponent', () => {
  let component: AutoAffectationComponent;
  let fixture: ComponentFixture<AutoAffectationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoAffectationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoAffectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
