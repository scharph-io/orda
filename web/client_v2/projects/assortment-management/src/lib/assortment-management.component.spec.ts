import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssortmentManagementComponent } from './assortment-management.component';

describe('AssortmentManagementComponent', () => {
  let component: AssortmentManagementComponent;
  let fixture: ComponentFixture<AssortmentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssortmentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssortmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
