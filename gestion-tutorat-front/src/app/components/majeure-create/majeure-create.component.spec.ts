import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajeureCreateComponent } from './majeure-create.component';

describe('MajeureCreateComponent', () => {
  let component: MajeureCreateComponent;
  let fixture: ComponentFixture<MajeureCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajeureCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MajeureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
