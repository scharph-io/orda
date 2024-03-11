import { Component, NgModule, inject } from '@angular/core';
import { MessageService } from '../services/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'orda-notification',
  standalone: true,
  template: ``,
})
export class NotificationComponent {
  private _message = inject(MessageService);
  private _snackBar = inject(MatSnackBar);

  constructor() {
    this._message.message$.subscribe((message) => {
      this._snackBar.open(message.title, undefined, {
        duration: 4000,
      });
    });
  }
}
