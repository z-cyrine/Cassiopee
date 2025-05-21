import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasCallbackComponent } from './cas-callback.component';

describe('CasCallbackComponent', () => {
  let component: CasCallbackComponent;
  let fixture: ComponentFixture<CasCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
