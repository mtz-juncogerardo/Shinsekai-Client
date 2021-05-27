import {Injectable} from '@angular/core';
import {CrudService} from './crud.service';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ImageBlobService {

  private path: string;

  constructor(private crud: CrudService, private storage: StorageService) {
    this.crud.setBearer(this.storage.getKey());
    this.crud.setEndpoint('images');
    this.path = '';
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('myFile', file);
    await this.crud.httpPost(formData).toPromise()
      .then(res => this.path = res.response);

    return Promise.resolve(this.path);
  }
}
