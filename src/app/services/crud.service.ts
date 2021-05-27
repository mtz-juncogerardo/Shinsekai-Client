import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {AlertService} from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private path: string;
  private httpHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient, private alertService: AlertService) {
    this.path = '';
  }

  setEndpoint(route: string): void {
    this.path = environment.endpoint + route;
  }

  setBearer(token: string): void {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  httpGet(): Observable<any> {
    return this.httpClient.get(this.path, this.httpHeaders)
      .pipe(
        retry(1),
        catchError(err => this.processError(err))
      );
  }

  httpPost(data: any): Observable<any> {
    return this.httpClient.post(this.path, JSON.stringify(data), this.httpHeaders)
      .pipe(
        retry(1),
        catchError((err: any) => {
          console.log('error', err.error.error);
          this.alertService.pushAlert({type: 'danger', message: err.error.error ?? err});
          return err;
        })
      );
  }

  httpPut(data: any): Observable<any> {
    return this.httpClient.put(this.path, JSON.stringify(data), this.httpHeaders)
      .pipe(
        retry(1),
        catchError(this.processError)
      );
  }

  processError(httpError: HttpErrorResponse): Observable<any> {
    const error = httpError.error;
    return throwError(error);
  }
}
