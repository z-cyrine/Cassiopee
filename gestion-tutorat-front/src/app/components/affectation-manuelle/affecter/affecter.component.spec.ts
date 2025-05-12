import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffecterComponent } from './affecter.component';

describe('AffecterComponent', () => {
  let component: AffecterComponent;
  let fixture: ComponentFixture<AffecterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffecterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffecterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
