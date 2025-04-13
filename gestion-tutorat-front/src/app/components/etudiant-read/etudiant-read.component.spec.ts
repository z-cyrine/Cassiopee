import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantReadComponent } from './etudiant-read.component';

describe('EtudiantReadComponent', () => {
  let component: EtudiantReadComponent;
  let fixture: ComponentFixture<EtudiantReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantReadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
