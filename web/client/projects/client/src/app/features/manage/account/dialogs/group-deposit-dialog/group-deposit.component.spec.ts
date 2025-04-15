import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDepositComponent } from './group-deposit.component';

describe('GroupDepositComponent', () => {
	let component: GroupDepositComponent;
	let fixture: ComponentFixture<GroupDepositComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GroupDepositComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GroupDepositComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
