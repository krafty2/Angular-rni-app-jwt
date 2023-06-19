import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSiteComponent } from './gestion-site.component';

describe('GestionSiteComponent', () => {
  let component: GestionSiteComponent;
  let fixture: ComponentFixture<GestionSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
