import {Injectable} from '@angular/core';
import {BehaviorSubject, observable, Observable} from 'rxjs';
import {IAlert} from '../core/Interfaces/IAlert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private incomingAlert: BehaviorSubject<IAlert>;

  incomingAlert$: Observable<IAlert>;

  constructor() {
    this.incomingAlert = new BehaviorSubject<IAlert>({
      message: '',
      type: 'success'
    });
    this.incomingAlert$ = this.incomingAlert.asObservable();
  }

  pushAlert(alertBox: IAlert): void {
    this.incomingAlert.next(alertBox);
  }
}
