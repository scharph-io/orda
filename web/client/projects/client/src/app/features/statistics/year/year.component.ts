import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { OrdaDateRange } from '@orda.shared/components/date-pickers/day-picker/day-picker.component';
import { YearPickerComponent } from '@orda.shared/components/date-pickers/year-picker/year-picker.component';

@Component({
  selector: 'orda-year',
  imports: [YearPickerComponent],
  template: `
    <div class="orda-date-picker">
      <orda-year-picker [year]="year()" (datesChanged)="changed($event)" />
      {{from().toLocaleDateString()}} - {{to().toLocaleDateString()}}
    </div>
  `,
  styles: ``,
})
export class YearComponent {
  queryMap = toSignal(inject(ActivatedRoute).queryParamMap);

  year = computed(() => {
    const x = this.queryMap()?.get('y')
    return x !== null && x !== undefined ? parseInt(x) : new Date().getFullYear()
  });

  from = signal(new Date());
  to = signal(new Date());

  public changed(range: OrdaDateRange) {
    this.from.set(range.from)
    this.to.set(range.to)
  }
}
