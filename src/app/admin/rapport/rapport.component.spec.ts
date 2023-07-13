import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportComponent } from './rapport.component';

describe('RapportComponent', () => {
  let component: RapportComponent;
  let fixture: ComponentFixture<RapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
