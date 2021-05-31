import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: BehaviorSubject<boolean>;

  loading$: Observable<boolean>;

  constructor() {
    this.loading = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loading.asObservable();
  }

  beginLoad(): void {
    this.loading.next(true);
  }

  endLoad(): void {
    this.loading.next(false);
  }
}
