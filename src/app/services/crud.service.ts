import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
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

  httpGet(query: string = '', customErr = ''): Observable<any> {
    return this.httpClient.get(this.path + query, this.httpHeaders)
      .pipe(
        retry(1),
        catchError(err => {
          this.processError(err, customErr);
          return err;
        })
      );
  }

  httpPost(data: any, customErr = ''): Observable<any> {
    return this.httpClient.post(this.path, JSON.stringify(data), this.httpHeaders)
      .pipe(
        retry(1),
        catchError(err => {
          this.processError(err, customErr);
          return err;
        })
      );
  }

  httpPut(data: any, customErr = ''): Observable<any> {
    return this.httpClient.put(this.path, JSON.stringify(data), this.httpHeaders)
      .pipe(
        retry(1),
        catchError(err => {
          this.processError(err, customErr);
          return err;
        })
      );
  }

  httpDelete(query: string = '', customErr = ''): Observable<any> {
    return this.httpClient.delete(this.path + '/delete/' + query, this.httpHeaders)
      .pipe(
        retry(1),
        catchError(err => {
          this.processError(err, customErr);
          return err;
        })
      );
  }

  httpUpload(data: FormData, token: string): Observable<any> {
    return this.httpClient.post(this.path, data, {reportProgress: true, observe: 'events', headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })});
  }

  private processError(error: any, customErr: string): void {
    console.log(error);
    const errorMessage = error?.error?.error ? error?.error?.error : 'Ocurrio un error desconocido';
    this.alertService.pushAlert({type: 'danger', message: customErr ? customErr : errorMessage});
  }
}
