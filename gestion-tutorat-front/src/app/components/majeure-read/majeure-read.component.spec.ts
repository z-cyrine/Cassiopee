import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajeureReadComponent } from './majeure-read.component';

describe('MajeureReadComponent', () => {
  let component: MajeureReadComponent;
  let fixture: ComponentFixture<MajeureReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajeureReadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MajeureReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
