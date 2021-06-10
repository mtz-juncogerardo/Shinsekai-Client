import {Injectable} from '@angular/core';
import {CrudService} from './crud.service';
import {StorageService} from './storage.service';
import {Observable} from 'rxjs';
import {IImage} from '../core/Interfaces/IImage';

@Injectable({
  providedIn: 'root'
})
export class ImageBlobService {

  private path: string;

  constructor(private crud: CrudService, private storage: StorageService) {
    this.path = '';
  }

  uploadFile(file: File): Observable<void> {
    console.log('file', file);
    this.crud.setEndpoint('images');
    const formData = new FormData();
    formData.append('myFile', file, file.name);
    console.log('formdata', formData);
    return this.crud.httpUpload(formData, this.storage.getKey());
  }

  deleteImages(images: IImage[]): void {
    this.crud.setEndpoint('images');

    images.forEach(item => {
      this.crud.httpDelete(`?blob=${item.path}`).toPromise()
        .then(res => console.log(res.response));
    });
  }
}
