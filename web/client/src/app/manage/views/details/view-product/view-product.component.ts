import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { ViewProduct } from '../../../../shared/model/product';

@Component({
  selector: 'orda-view-product',
  template: ` {{ product().name }} `,
  standalone: true,
  styles: [``],
  imports: [],
})
export class ViewProductComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.ele.nativeElement.style.backgroundColor = this.product().color;
  }
  product = input.required<ViewProduct>();

  ele = inject(ElementRef);
}
