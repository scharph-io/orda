import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum Severity {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface Message {
  title: string;
  severity?: Severity;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _message: Subject<Message> = new Subject<Message>();

  public readonly message$ = this._message.asObservable();

  send(message: Message) {
    this._message.next(message);
  }
}
