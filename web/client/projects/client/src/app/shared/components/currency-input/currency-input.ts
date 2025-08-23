import { Component } from '@angular/core';
import { NgControl, AbstractControlDirective } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable } from 'rxjs';

@Component({
	selector: 'orda-currency-input',
	template: ``,
	styles: ``,
	providers: [{ provide: MatFormFieldControl, useExisting: CurrencyInput }],
})
export class CurrencyInput implements MatFormFieldControl<CurrencyInput> {
	value: CurrencyInput | null;
	stateChanges: Observable<void>;
	id: string;
	placeholder: string;
	ngControl: NgControl | AbstractControlDirective | null;
	focused: boolean;
	empty: boolean;
	shouldLabelFloat: boolean;
	required: boolean;
	disabled: boolean;
	errorState: boolean;
	controlType?: string | undefined;
	autofilled?: boolean | undefined;
	userAriaDescribedBy?: string | undefined;
	disableAutomaticLabeling?: boolean | undefined;
	describedByIds?: string[] | undefined;
	override setDescribedByIds(ids: string[]): void {
		throw new Error('Method not implemented.');
	}
	override onContainerClick(event: MouseEvent): void {
		throw new Error('Method not implemented.');
	}
}
