import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajeureEditComponent } from './majeure-edit.component';

describe('MajeureEditComponent', () => {
  let component: MajeureEditComponent;
  let fixture: ComponentFixture<MajeureEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajeureEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MajeureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
