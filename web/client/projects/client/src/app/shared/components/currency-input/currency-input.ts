import {
	Component,
	computed,
	DestroyRef,
	effect,
	ElementRef,
	inject,
	input,
	signal,
	viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FocusMonitor } from '@angular/cdk/a11y';

let nextId = 0;

@Component({
	selector: 'orda-currency-input',
	imports: [FormsModule, MatInput],
	template: ` <div class="currency-input-container" [class.focused]="focused">
		<input
			matInput
			#input
			class="currency-input"
			(input)="onInput($event)"
			(blur)="onBlur()"
			[value]="displayValue()"
			(focus)="onFocus()"
			type="text"
			inputmode="decimal"
		/>
	</div>`,
	styles: [
		`
			.currency-input-container {
				display: flex;
				align-items: center;
				width: 100%;
			}

			.currency-input {
				border: none;
				outline: none;
				background: transparent;
				font: inherit;
				color: inherit;
				width: 100%;
				padding: 0;
				text-align: right;
			}

			.currency-input:disabled {
				color: rgba(0, 0, 0, 0.38);
				cursor: not-allowed;
			}

			.currency-input::placeholder {
				color: rgba(0, 0, 0, 0.6);
			}
		`,
	],
	providers: [
		{
			provide: MatFormFieldControl,
			useExisting: CurrencyInputComponent,
		},
	],
	host: {
		'[class.floating]': 'shouldLabelFloat',
		'[id]': 'id',
		'[attr.aria-describedby]': 'describedBy',
	},
})
export class CurrencyInputComponent implements MatFormFieldControl<number>, ControlValueAccessor {
	ngControl = inject(NgControl, { optional: true, self: true });
	readonly placeholderSignal = input<string>('');
	readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
	readonly currencySymbol = input<string>('€');
	readonly locale = input<string>('de-DE');
	readonly maxFractionDigits = input<number>(2);
	readonly stateChanges = new Subject<void>();
	readonly id = `currency-input-${nextId++}`;
	empty = false;
	required = false;
	disabled = false;
	errorState = false;
	private readonly focusMonitor = inject(FocusMonitor);
	private readonly elementRef = inject(ElementRef<HTMLElement>);
	private readonly destroyRef = inject(DestroyRef);
	private readonly _value = signal<number | null>(null);
	readonly displayValue = computed(() => {
		const val = this._value();
		if (val === null || val === undefined) {
			return '';
		}
		const euros = val / 100;
		const formatter = new Intl.NumberFormat(this.locale(), {
			minimumFractionDigits: 0,
			maximumFractionDigits: this.maxFractionDigits(),
		});

		return `${formatter.format(euros)} ${this.currencySymbol()}`;
	});
	private readonly _focused = signal<boolean>(false);
	private readonly _touched = signal<boolean>(false);
	readonly touched = this._touched.asReadonly();
	private readonly _describedBy = signal<string>('');

	constructor() {
		// Set up NgControl if available
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}

		// Monitor focus state
		this.focusMonitor
			.monitor(this.elementRef, true)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((origin) => {
				this._focused.set(!!origin);
				this.stateChanges.next();
			});

		// Effect to notify of state changes
		effect(() => {
			// React to signal changes that should trigger state change notifications
			this._value();
			this._focused();
			this.touched();

			this.stateChanges.next();
		});
	}

	get value(): number | null {
		return this._value();
	}

	get placeholder(): string {
		return this.placeholderSignal();
	}

	get focused(): boolean {
		return this._focused();
	}

	get shouldLabelFloat(): boolean {
		return this._focused() || this._value() != null;
	}

	get describedBy(): string {
		return this._describedBy();
	}
	controlType?: string | undefined;
	autofilled?: boolean | undefined;
	userAriaDescribedBy?: string | undefined;
	disableAutomaticLabeling?: boolean | undefined;
	describedByIds?: string[] | undefined;

	setDescribedByIds(ids: string[]): void {
		this._describedBy.set(ids.join(' '));
	}

	onContainerClick(): void {
		if (!this.focused) {
			this.inputRef().nativeElement.focus();
		}
	}

	writeValue(value: number | null): void {
		this._value.set(value);
	}

	registerOnChange(fn: (value: number | null) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	onInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		const rawValue = input.value as unknown as number;

		// Parse the input value and convert to cents
		// const parsedValue = this.parseInputToCents(rawValue);
		this._value.set(rawValue);
		this.onChange(rawValue);
	}

	onFocus(): void {
		if (!this.focused) {
			this._focused.set(true);

			// When focusing, show the numeric value for easier editing
			const currentValue = this._value();
			if (currentValue !== null) {
				const euros = currentValue / 100;
				const formatter = new Intl.NumberFormat(this.locale(), {
					minimumFractionDigits: 0,
					maximumFractionDigits: this.maxFractionDigits(),
				});
				this.inputRef().nativeElement.value = formatter.format(euros);
			}
		}
	}

	onBlur(): void {
		this._focused.set(false);
		this._touched.set(true);
		this.onTouched();

		// When blurring, reformat to show currency symbol
		const input = this.inputRef().nativeElement;
		input.value = this.displayValue();
	}

	private onChange: (value: number | null) => void = () => {
		return;
	};

	private onTouched = () => {
		return;
	};
}
