import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {CrudService} from '../../services/crud.service';
import {ImageBlobService} from '../../services/image-blob.service';
import {AlertService} from '../../services/alert.service';
import {IPromotions} from '../../core/Interfaces/IPromotions';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IImage} from '../../core/Interfaces/IImage';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-carousels',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  carousels: IPromotions[];
  selectedCarousel: IPromotions;
  editFlag: boolean;
  form: FormGroup;
  imagePath: IImage;
  blockButton: boolean;
  loadingGif: string;

  constructor(private formBuilder: FormBuilder,
              private loader: LoaderService,
              private crud: CrudService,
              private blob: ImageBlobService,
              private alert: AlertService) {
    this.carousels = [];
    this.selectedCarousel = {};
    this.editFlag = false;
    this.imagePath = {};
    this.blockButton = true;
    this.loadingGif = 'assets/loading.gif';
    this.form = this.formBuilder.group({
      id: [null],
      imagePath: [null],
      redirectPath: [null]
    });
  }

  ngOnInit(): void {
    this.getCarousels();
  }

  private getCarousels(): void {
    this.crud.setEndpoint('carousels/read');
    this.crud.httpGet().toPromise()
      .then(res => this.carousels = res.response);
  }

  setCarousel(carousel: IPromotions): void {
    this.selectedCarousel = carousel;
  }

  removeImagePath(): void {
    if (this.imagePath === this.loadingGif) {
      return;
    }

    this.blob.deletePromotionsImage(this.imagePath.path ? this.imagePath.path : '');

    this.imagePath = {};
    this.blockButton = true;
  }

  loadImage(event: any): void {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    this.imagePath = {id: 'gif', path: this.loadingGif};

    const uploadSubscription = this.blob.uploadFile(file).subscribe((e: any) => {
      if (e.type === HttpEventType.UploadProgress) {
        const progress = Math.round(100 * e.loaded / e.total);
        console.log('progress', progress);
      } else if (e.type === HttpEventType.Response) {
        this.imagePath = e.body.response;
        this.blockButton = false;
        uploadSubscription.unsubscribe();
      }
    });
  }

  deleteImage(): void {
    if (this.editFlag) {
      return;
    }

    this.removeImagePath();
  }

  submit(): void {
    if (Object.keys(this.imagePath).length === 0) {
      return;
    }

    this.loader.beginLoad();

    const redirectPath = this.form.get('redirectPath')?.value ? this.form.get('redirectPath')?.value : '';

    this.form.patchValue({
      imagePath: this.imagePath.path,
      redirectPath
    });

    if (this.editFlag) {
      this.crud.setEndpoint('carousels/update');
      this.crud.httpPut(this.form.value).toPromise()
        .then(res => {
          this.carousels = this.carousels.map(p => p.id === res.response.id ? res.response : p);
          this.alert.pushAlert({type: 'success', message: 'el carrusel se actualizó'});
          this.form.reset();
          this.imagePath = {};
        }).finally(() => this.loader.endLoad());

      return;
    }

    this.crud.setEndpoint('carousels/create');
    this.crud.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.carousels.unshift(res.response);
          this.alert.pushAlert({type: 'success', message: 'el carrusel se agrego con extio'});
          this.form.reset();
          this.imagePath = {};
          this.blockButton = true;
        }
      })
      .finally(() => this.loader.endLoad());
  }

  async delete(): Promise<void> {
    if (!this.selectedCarousel.id) {
      return;
    }

    this.loader.beginLoad();
    this.crud.setEndpoint('carousels');

    await this.crud.httpDelete(`?id=${this.selectedCarousel.id}`).toPromise()
      .then(res => {
        if (res.response) {
          this.blob.deletePromotionsImage(this.selectedCarousel.imagePath ? this.selectedCarousel.imagePath : '');
          this.alert.pushAlert({type: 'success', message: 'Carrusel eliminada con exito'});
          this.carousels = this.carousels.filter(p => p.id !== this.selectedCarousel.id);
        }
      })
      .finally(() => this.loader.endLoad());
  }

  update(carousel: IPromotions): void {
    this.editFlag = true;
    this.blockButton = false;

    this.form.patchValue({
      id: carousel.id,
      redirectPath: carousel.redirectPath
    });

    this.imagePath = {path: carousel.imagePath};
  }

  cleanForms(): void {
    this.form.reset();
    this.imagePath = {};
    this.blockButton = false;
    this.editFlag = false;
  }
}
