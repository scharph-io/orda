import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusMinusTileComponent } from './plus-minus-tile.component';

describe('PlusMinusTileComponent', () => {
  let component: PlusMinusTileComponent;
  let fixture: ComponentFixture<PlusMinusTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlusMinusTileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlusMinusTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
