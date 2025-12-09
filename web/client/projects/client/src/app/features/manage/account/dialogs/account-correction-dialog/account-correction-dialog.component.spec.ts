import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCorrectionDialogComponent } from './account-correction-dialog.component';

describe('AccountCorrectionDialogComponent', () => {
  let component: AccountCorrectionDialogComponent;
  let fixture: ComponentFixture<AccountCorrectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCorrectionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCorrectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
