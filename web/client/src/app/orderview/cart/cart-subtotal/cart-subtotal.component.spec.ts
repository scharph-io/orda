import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSubtotalComponent } from './cart-subtotal.component';

describe('CartHeaderComponent', () => {
  let component: CartSubtotalComponent;
  let fixture: ComponentFixture<CartSubtotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSubtotalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSubtotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
