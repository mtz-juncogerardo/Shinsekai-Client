import {Component, OnInit, OnDestroy} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {Subscriber, Subscription} from 'rxjs';
import {IAlert} from '../../core/Interfaces/IAlert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  alertBox: IAlert;
  show: boolean;
  alertSub: Subscription;
  firstSubFlag: boolean;

  constructor(private alertService: AlertService) {
    this.alertBox = {
      message: '',
      type: 'success'
    };
    this.alertSub = new Subscription();
    this.show = false;
    this.firstSubFlag = true;
  }

  ngOnInit(): void {
    this.alertSub = this.alertService.incomingAlert$.subscribe(alert => {
      if (this.firstSubFlag)
      {
        this.firstSubFlag = false;
        return;
      }
      this.alertBox = alert;
      this.show = true;
      setTimeout(() => this.show = false, 4000);
    });
  }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }
}
