import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierRniComponent } from './fichier-rni.component';

describe('FichierRniComponent', () => {
  let component: FichierRniComponent;
  let fixture: ComponentFixture<FichierRniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichierRniComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichierRniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
