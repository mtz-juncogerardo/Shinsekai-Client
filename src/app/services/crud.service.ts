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

  httpGet(query: string = ''): Observable<any> {
    return this.httpClient.get(this.path + query, this.httpHeaders)
      .pipe(
        retry(1),
        catchError((err: any) => {
          console.log('error', err?.error?.error ?? err);
          return err?.error?.error ?? err;
        })
      );
  }

  httpPost(data: any): Observable<any> {
    return this.httpClient.post(this.path, JSON.stringify(data), this.httpHeaders)
      .pipe(
        retry(1),
        catchError((err: any) => {
          console.log('error', err?.error?.error ?? err);
          return err?.error?.error ?? err;
        })
      );
  }

  httpUpload(data: FormData, token: string): Observable<any> {
    return this.httpClient.post(this.path, data, {reportProgress: true, observe: 'events', headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })});
  }

  httpPut(data: any): Observable<any> {
    return this.httpClient.put(this.path, JSON.stringify(data), this.httpHeaders)
      .pipe(
        retry(1),
        catchError((err: any) => {
          console.log('error', err?.error?.error ?? err);
          this.alertService.pushAlert({type: 'danger', message: err?.error?.error ?? 'Ocurrio un Error desconocido'});
          return err?.error?.error ?? err;
        })
      );
  }

  httpDelete(query: string = ''): Observable<any> {
    return this.httpClient.delete(this.path + '/delete/' + query, this.httpHeaders)
      .pipe(
        retry(1),
        catchError((err: any) => {
          console.log('error', err?.error?.error ?? err);
          this.alertService.pushAlert({type: 'danger', message: err?.error?.error ?? 'Ocurrio un Error desconocido'});
          return err?.error?.error ?? err;
        })
      );
  }

}
