import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  private loaderSub: Subscription;

  loadFlag: boolean;

  constructor(private loader: LoaderService) {
    this.loaderSub = new Subscription();
    this.loadFlag = false;
  }

  ngOnInit(): void {
    this.loaderSub = this.loader.loading$.subscribe(loadFlag => {
      this.loadFlag = loadFlag;

      if (this.loadFlag) {
        setTimeout(() => this.loadFlag = false, 10000);
      }
    });
  }

  ngOnDestroy(): void {
    this.loaderSub.unsubscribe();
  }

}
