import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoutDetailDialogComponent } from './account-detail-dialog.component';

describe('AccoutDetailDialogComponent', () => {
	let component: AccoutDetailDialogComponent;
	let fixture: ComponentFixture<AccoutDetailDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AccoutDetailDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AccoutDetailDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
