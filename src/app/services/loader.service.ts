import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: BehaviorSubject<boolean>;
  private loaderQueue: number;

  loading$: Observable<boolean>;

  constructor() {
    this.loading = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loading.asObservable();
    this.loaderQueue = 0;
  }

  beginLoad(): void {
    this.loaderQueue++;
    this.loading.next(true);
  }

  endLoad(): void {
    this.loaderQueue--;

    if (this.loaderQueue === 0) {
      this.loading.next(false);
    }
  }
}
