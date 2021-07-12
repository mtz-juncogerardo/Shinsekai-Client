import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {StorageService} from '../../services/storage.service';
import {LoaderService} from '../../services/loader.service';
import {IArticle} from '../../core/Interfaces/IArticle';
import {IResponse} from '../../core/Interfaces/IResponse';
import {AlertService} from '../../services/alert.service';
import {IObject} from '../../core/Interfaces/IObject';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ImageBlobService} from '../../services/image-blob.service';
import {HttpEventType} from '@angular/common/http';
import {ITag} from '../../core/Interfaces/ITag';
import {IImage} from '../../core/Interfaces/IImage';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  originalArticles: IArticle[];
  inputPage: number;
  loadingGif: string;
  searchInput: string;
  selectedArticle: IObject;
  form: FormGroup;
  dateAdded: string;
  selectedAnimes: ITag[];
  selectedBrands: ITag[];
  selectedLines: ITag[];
  selectedMaterials: ITag[];
  animes: any[];
  lines: any[];
  materials: any[];
  brands: any[];
  originalSerial: string;
  imagePaths: IImage[];
  blockButton: boolean;
  editFlag: boolean;
  private creatingTag: boolean;
  @Input() maxPage: number;
  @Input() page: number;
  @Input() search: string;
  @Input() articles: IArticle[];
  @Output() articleRefresh: EventEmitter<IResponse>;
  @Output() searchDetected: EventEmitter<string>;

  constructor(private formBuilder: FormBuilder,
              private crud: CrudService,
              private storage: StorageService,
              private loader: LoaderService,
              private alert: AlertService,
              private imageBlob: ImageBlobService) {
    this.crud.setEndpoint('articles');
    this.crud.setBearer(this.storage.getKey());
    this.loadingGif = 'assets/loading.gif';
    this.originalArticles = [];
    this.imagePaths = [];
    this.blockButton = false;
    this.creatingTag = false;
    this.inputPage = 1;
    this.selectedArticle = {
      id: '',
      name: ''
    };
    this.editFlag = false;
    this.dateAdded = '';
    this.selectedAnimes = [];
    this.selectedLines = [];
    this.selectedMaterials = [];
    this.selectedBrands = [];
    this.animes = [];
    this.lines = [];
    this.materials = [];
    this.brands = [];
    this.originalSerial = '';
    this.search = '';
    this.articles = [];
    this.maxPage = 1;
    this.page = 1;
    this.searchInput = '';
    this.articleRefresh = new EventEmitter<IResponse>();
    this.searchDetected = new EventEmitter<string>();
    this.form = this.formBuilder.group({
      id: [null],
      name: [
        null,
        Validators.required,
      ],
      details: [
        null,
        Validators.required,
      ],
      height: [
        null,
        Validators.required
      ],
      price: [
        null,
        Validators.required
      ],
      discountPrice: [
        0,
      ],
      stock: [
        null,
        Validators.required
      ],
      originalFlag: [
        false,
      ],
      originalSerial: [
        null,
      ],
      images: [
        [],
      ],
      brandId: [
        null,
      ],
      materials: [
        [],
      ],
      lines: [
        [],
      ],
      animes: [
        [],
      ],
    });
  }

  ngOnInit(): void {
    this.searchInput = this.search;

    if (this.articles.length === 0) {
      this.getArticles();
      return;
    }

    this.inputPage = this.page;
  }

  private getArticles(search: string = ''): void {
    this.crud.setEndpoint('articles');
    if (this.searchInput && !search) {
      search = this.searchInput;
    }

    this.searchDetected.emit(search);

    this.loader.beginLoad();

    this.crud.httpGet(`?page=${this.page}&search=${search}`).toPromise()
      .then(res => {
        this.articleRefresh.emit(res);
        this.loader.endLoad();
      });
  }

  searchArticles(event: any = {}): void {
    if (Object.keys(event).length > 0 && event.keyCode !== 13 || this.search === this.searchInput) {
      return;
    }

    this.page = 0;
    this.inputPage = 1;

    this.getArticles(this.searchInput);
  }

  nextPage(): void {
    if (this.inputPage > this.maxPage || this.page === this.inputPage) {
      this.loader.endLoad();
      return;
    }

    this.page = this.inputPage;
    this.getArticles();
  }

  async delete(id: string): Promise<void> {
    this.loader.beginLoad();
    this.crud.setEndpoint('articles');

    await this.crud.httpDelete(`?id=${id}`).toPromise()
      .then(res => {
        if (res.response) {
          this.alert.pushAlert({type: 'success', message: 'Articulo eliminado con exito'});
          this.articles = this.articles.filter(article => article.id !== id);
          this.articleRefresh.emit({response: this.articles, page: this.page, maxPage: this.maxPage});
        }
      })
      .finally(() => this.loader.endLoad());
  }

  selectArticle(id: string, name: string): void {
    this.selectedArticle = {
      id,
      name
    };
  }

  readArticle(id: string, name: string): void {
    this.crud.setEndpoint('articles/read');
    this.crud.httpGet(`?id=${id}`).toPromise()
      .then(res => {
        const article: IArticle = res.response;

        this.dateAdded = article.dateAdded !== undefined ? new Date(article.dateAdded.toLocaleString()).toString() : '10-09-1992';
        this.animes = article.animes?.map(i => i.name) || ['N/A'];
        this.lines = article.lines?.map(i => i.name) || ['N/A'];
        this.materials = article.materials?.map(i => i.name) || ['N/A'];
        this.brands = article.brand?.map(i => i.name) || ['N/A'];
        this.originalSerial = article.originalSerial || 'N/A';
        this.imagePaths = article.images;
      });

    this.selectedArticle = {
      id,
      name
    };
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const originalFlagForm = this.form.get('originalFlag')?.value;
    const discountPriceForm = this.form.get('discountPrice')?.value;

    if (this.imagePaths.length === 0) {
      this.alert.pushAlert({type: 'warning', message: 'Tu articulo necesita al menos una imagen'});
      return;
    }

    this.loader.beginLoad();
    this.form.patchValue({
      images: this.imagePaths,
      animes: this.selectedAnimes,
      brandId: this.selectedBrands[0]?.id !== undefined ? this.selectedBrands[0]?.id : null,
      lines: this.selectedLines,
      materials: this.selectedMaterials,
      originalFlag: originalFlagForm ? originalFlagForm : false,
      discountPrice: discountPriceForm ? discountPriceForm : 0
    });

    console.log(this.form.value);
    if (this.editFlag) {
      this.crud.setEndpoint('articles/update');
      await this.crud.httpPut(this.form.value).toPromise()
        .then(res => {
          if (res.response) {
            this.alert.pushAlert({type: 'success', message: 'El articulo se actualizo con exito'});
            this.articles = this.articles.filter(article => article.id !== res.response.id);
            this.articles.unshift(res.response);
            this.articleRefresh.emit({response: this.articles, page: this.page, maxPage: this.maxPage});
          }
        }).finally(() => this.loader.endLoad());

      return;
    }

    this.crud.setEndpoint('articles/create');
    await this.crud.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.alert.pushAlert({type: 'success', message: 'El articulo se guardo con exito'});
          this.articles.unshift(res.response);
          this.articleRefresh.emit({response: this.articles, page: this.page, maxPage: this.maxPage});
        }
      }).finally(() => this.loader.endLoad());
  }

  loadImage(event: any): void {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    this.imagePaths.push({id: 'gif', path: this.loadingGif});
    this.blockButton = true;

    const uploadSubscription = this.imageBlob.uploadFile(file).subscribe((e: any) => {
      if (e.type === HttpEventType.UploadProgress) {
        const progress = Math.round(100 * e.loaded / e.total);
        console.log('progress', progress);
      } else if (e.type === HttpEventType.Response) {
        this.imagePaths.pop();
        this.blockButton = false;
        uploadSubscription.unsubscribe();
        const uploadedImage = e.body.response;
        uploadedImage.order = Date.now();
        this.imagePaths.push(uploadedImage);
        console.log(this.imagePaths);
      }
    });
  }

  removeImagePath(image: IImage | undefined): void {
    if (image?.path === this.loadingGif) {
      console.log(image);
      return;
    }

    this.imagePaths = this.imagePaths.filter(p => p.path !== image?.path);
    this.imageBlob.deleteImages([image]);
  }

  deleteImages(): void {
    if (this.editFlag) {
      return;
    }
    this.form.reset();
    this.imageBlob.deleteImages(this.imagePaths);
    this.imagePaths = [];
  }

  async getArticleCombos(articleId: string = ''): Promise<void> {

    if (articleId) {
      this.editFlag = true;
    }

    this.form.reset();
    this.selectedBrands = [];
    this.selectedMaterials = [];
    this.selectedAnimes = [];
    this.selectedLines = [];
    this.imagePaths = [];
    this.editFlag = !!articleId;
    this.crud.setEndpoint('articles/originals');
    await this.crud.httpGet().toPromise().then(res => this.originalArticles = res.response);

    this.crud.setEndpoint('tags');
    this.crud.httpGet('?byAnime=true').toPromise().then(res => this.animes = res.response);
    this.crud.httpGet('?byMaterial=true').toPromise().then(res => this.materials = res.response);
    this.crud.httpGet('?byLine=true').toPromise().then(res => this.lines = res.response);
    this.crud.httpGet('?byBrand=true').toPromise().then(res => this.brands = res.response);

    if (this.editFlag) {
      this.crud.setEndpoint('articles/read?id=');
      this.crud.httpGet(articleId).toPromise().then(res => {
        this.populateForm(res.response);
      });
    }
  }

  addTag(tagType: string, tag: any, justAdded = false): void {
    const splittedTag = tag.split(',');
    const myTag: ITag = {
      id: splittedTag[0],
      name: splittedTag[1]
    };

    switch (tagType) {
      case 'anime':
        const animeExists = this.selectedAnimes.find(r => r.id === myTag.id);
        if (animeExists) {
          return;
        }
        break;
      case 'material':
        const materialExists = this.selectedMaterials.find(r => r.id === myTag.id);
        if (materialExists) {
          return;
        }
        break;
      case 'line':
        const lineExists = this.selectedLines.find(r => r.id === myTag.id);
        if (lineExists) {
          return;
        }
        break;
      case 'brand':
        const brandExists = this.selectedBrands.find(r => r.id === myTag.id);
        if (brandExists) {
          return;
        }
        break;
    }

    switch (tagType) {
      case 'anime':
        this.selectedAnimes.push(myTag);
        if (justAdded) {
          this.animes.push(myTag);
        }
        break;
      case 'material':
        this.selectedMaterials.push(myTag);
        if (justAdded) {
          this.materials.push(myTag);
        }
        break;
      case 'line':
        this.selectedLines.push(myTag);
        if (justAdded) {
          this.lines.push(myTag);
        }
        break;
      case 'brand':
        this.selectedBrands.push(myTag);
        if (justAdded) {
          this.brands.push(myTag);
        }
        break;
    }
  }

  addOriginal(originalId: string): void {
    this.form.patchValue({originalSerial: originalId});
  }

  createTag(tagType: string, name: string, event: any): void {
    if (event.keyCode !== 13) {
      return;
    }
    if (this.creatingTag || !name) {
      return;
    }
    this.creatingTag = true;

    if (tagType === 'anime') {
      const animeExists = this.animes.find(r => r.name.toLowerCase() === name.toLowerCase());

      if (animeExists) {
        this.alert.pushAlert({type: 'warning', message: 'El tag ya existe, intenta seleccionarlo desde el menu'});
        this.creatingTag = false;
        return;
      }

      this.crud.setEndpoint('tags/anime/create');
      this.crud.httpPost({name}).toPromise()
        .then(res => this.addTag('anime', `${res.response.id},${res.response.name}`, true))
        .finally(() => this.creatingTag = false);

      return;
    }

    if (tagType === 'material') {
      const materialExists = this.materials.find(r => r.name.toLowerCase() === name.toLowerCase());

      if (materialExists) {
        this.alert.pushAlert({type: 'warning', message: 'El tag ya existe, intenta seleccionarlo desde el menu'});
        this.creatingTag = false;
        return;
      }

      this.crud.setEndpoint('tags/material/create');
      this.crud.httpPost({name}).toPromise()
        .then(res => this.addTag('material', `${res.response.id},${res.response.name}`, true))
        .finally(() => this.creatingTag = false);

      return;
    }

    if (tagType === 'line') {
      const lineExists = this.lines.find(r => r.name.toLowerCase() === name.toLowerCase());

      if (lineExists) {
        this.alert.pushAlert({type: 'warning', message: 'El tag ya existe, intenta seleccionarlo desde el menu'});
        this.creatingTag = false;
        return;
      }

      this.crud.setEndpoint('tags/line/create');
      this.crud.httpPost({name}).toPromise()
        .then(res => this.addTag('line', `${res.response.id},${res.response.name}`, true))
        .finally(() => this.creatingTag = false);

      return;
    }

    if (tagType === 'brand') {
      const brandExists = this.brands.find(r => r.name.toLowerCase() === name.toLowerCase());

      if (brandExists) {
        this.alert.pushAlert({type: 'warning', message: 'El tag ya existe, intenta seleccionarlo desde el menu'});
        this.creatingTag = false;
        return;
      }

      this.crud.setEndpoint('tags/brand/create');
      this.crud.httpPost({name}).toPromise()
        .then(res => this.addTag('brand', `${res.response.id},${res.response.name}`, true))
        .finally(() => this.creatingTag = false);
      return;
    }

    this.creatingTag = false;
  }

  removeTag(tagType: string, id: string): void {
    switch (tagType) {
      case 'anime':
        this.selectedAnimes = this.selectedAnimes.filter(r => r.id !== id);
        break;
      case 'material':
        this.selectedMaterials = this.selectedMaterials.filter(r => r.id !== id);
        break;
      case 'line':
        this.selectedLines = this.selectedLines.filter(r => r.id !== id);
        break;
      case 'brand':
        this.selectedBrands = this.selectedBrands.filter(r => r.id !== id);
        break;
    }
  }

  private populateForm(article: any): void {
    this.selectedBrands = article.brand;
    this.selectedLines = article.lines;
    this.selectedAnimes = article.animes;
    this.selectedMaterials = article.materials;
    this.imagePaths = article.images;
    this.form.patchValue({
      id: article?.id,
      name: article?.name,
      details: article?.details,
      height: article?.height,
      price: article?.price,
      discountPrice: article?.discountPrice,
      stock: article?.stock,
      originalFlag: article?.originalFlag,
      originalSerial: article?.originalSerial,
      images: article?.images,
      brandId: article?.brand[0].id,
      materials: article?.materials,
      lines: article?.lines,
      animes: article?.animes,
    });
  }
}
