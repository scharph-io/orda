import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositHistoryDialogComponent } from './deposit-history-dialog.component';

describe('DepositHistoryDialogComponent', () => {
	let component: DepositHistoryDialogComponent;
	let fixture: ComponentFixture<DepositHistoryDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DepositHistoryDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DepositHistoryDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
