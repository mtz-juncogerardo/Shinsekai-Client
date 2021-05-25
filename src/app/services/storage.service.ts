import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private tokenRef = 'shau';

  set(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  delete(key: string): void {
    window.localStorage.removeItem(key);
  }

  get(key: string): any {
    return window.localStorage.getItem(key);
  }

  setKey(token: string): void {
    window.localStorage.setItem(this.tokenRef, token);
  }

  getKey(): any {
    return window.localStorage.getItem(this.tokenRef);
  }

  deleteKey(): void {
    window.localStorage.removeItem(this.tokenRef);
  }
}

