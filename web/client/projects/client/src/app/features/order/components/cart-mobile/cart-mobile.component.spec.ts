import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartMobileComponent } from './cart-mobile.component';

describe('CartMobileComponent', () => {
  let component: CartMobileComponent;
  let fixture: ComponentFixture<CartMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartMobileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
