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
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  promotions: IPromotions[];
  selectedPromotion: IPromotions;
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
    this.promotions = [];
    this.selectedPromotion = {};
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
    this.getPromotions();
  }

  private getPromotions(): void {
    this.crud.setEndpoint('promotions/read');
    this.crud.httpGet().toPromise()
      .then(res => this.promotions = res.response);
  }

  setPromotion(promotion: IPromotions): void {
    this.selectedPromotion = promotion;
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
      this.crud.setEndpoint('promotions/update');
      this.crud.httpPut(this.form.value).toPromise()
        .then(res => {
          this.promotions = this.promotions.map(p => p.id === res.response.id ? res.response : p);
          this.alert.pushAlert({type: 'success', message: 'La promoción se actualizó'});
          this.form.reset();
          this.imagePath = {};
        }).finally(() => this.loader.endLoad());

      return;
    }

    this.crud.setEndpoint('promotions/create');
    this.crud.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.promotions.unshift(res.response);
          this.alert.pushAlert({type: 'success', message: 'La promoción se agrego con extio'});
          this.form.reset();
          this.imagePath = {};
          this.blockButton = true;
        }
      })
      .finally(() => this.loader.endLoad());
  }

  async delete(): Promise<void> {
    if (!this.selectedPromotion.id) {
      return;
    }

    this.loader.beginLoad();
    this.crud.setEndpoint('promotions');

    await this.crud.httpDelete(`?id=${this.selectedPromotion.id}`).toPromise()
      .then(res => {
        if (res.response) {
          this.blob.deletePromotionsImage(this.selectedPromotion.imagePath ? this.selectedPromotion.imagePath : '');
          this.alert.pushAlert({type: 'success', message: 'Promoción eliminada con exito'});
          this.promotions = this.promotions.filter(p => p.id !== this.selectedPromotion.id);
        }
      })
      .finally(() => this.loader.endLoad());
  }

  update(promotion: IPromotions): void {
    this.editFlag = true;
    this.blockButton = false;

    this.form.patchValue({
      id: promotion.id,
      redirectPath: promotion.redirectPath
    });

    this.imagePath = {path: promotion.imagePath};
  }

  cleanForms(): void {
    this.form.reset();
    this.imagePath = {};
    this.blockButton = false;
    this.editFlag = false;
  }
}
