import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../../../services/loader.service';
import {AlertService} from '../../../services/alert.service';
import {CrudService} from '../../../services/crud.service';
import {IArticle} from '../../../core/Interfaces/IArticle';
import {StorageService} from '../../../services/storage.service';
import {IUser} from '../../../core/Interfaces/IUser';
import {IImage} from '../../../core/Interfaces/IImage';

@Component({
  selector: 'app-articles-details',
  templateUrl: './articles-details.component.html',
  styleUrls: ['./articles-details.component.scss']
})
export class ArticlesDetailsComponent implements OnInit {

  article: IArticle;
  original: IArticle;
  replica: IArticle;
  user: IUser;
  mainImage: IImage;
  subImages: IImage[];
  inStock: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private loader: LoaderService,
              private alert: AlertService,
              private crud: CrudService,
              private storage: StorageService) {
    this.article = {id: '', images: [], name: ''};
    this.user = {};
    this.mainImage = {};
    this.subImages = [];
    this.inStock = false;
    this.original = {id: '', images: [], name: ''};
    this.replica = {id: '', images: [], name: ''};
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    await this.getUser();
    this.getArticle();
  }

  private getArticle(): void {
    this.crud.setEndpoint('articles/read?id=');
    const id = this.route.snapshot.params.id;

    this.crud.httpGet(id).toPromise()
      .then(res => {
        this.article = res.response;
        this.article.quantity = 1;
        this.inStock = this.article?.stock !== undefined && this.article?.stock > 0;
        this.mainImage = this.article.images[0];
        this.subImages = this.article.images;
        this.subImages.shift();
      })
      .finally(() => {
        console.log(this.article);
        if (!this.article.id) {
          this.loader.endLoad();
          this.router.navigate(['articles']);
          return;
        }

        this.getOriginalReplica();
        this.loader.endLoad();
      });
  }

  private async getUser(): Promise<void> {
    const token = this.storage.getKey();

    if (!token || token.length < 50) {
      this.storage.deleteKey();
      return;
    }

    this.crud.setEndpoint('user');
    this.crud.setBearer(token);
    this.crud.httpGet('', 'La sesión caduco').toPromise()
      .then(res => this.user = res.response)
      .catch(() => this.storage.deleteKey())
      .finally(() => this.loader.endLoad());
  }

  modifyQuantity(quantity: 'less' | 'more'): void {
    const currentQuantity = this.article.quantity !== undefined ? this.article.quantity : 1;

    if (quantity === 'less') {
      this.article.quantity = currentQuantity === 1 ? 1 : currentQuantity - 1;
    }

    if (quantity === 'more') {
      const maxQuantity = this.article.stock !== undefined ? this.article.stock : 0;
      this.article.quantity = currentQuantity >= maxQuantity ? maxQuantity : currentQuantity + 1;
    }
  }

  private getOriginalReplica(): void {
    this.crud.setEndpoint('articles/replicas');
    this.crud.httpGet(`?originalId=${this.article.id}`).toPromise()
      .then(res => {
        if (res.response) {
          this.replica = res.response;
          console.log('rep', this.replica);
        }
      });

    this.crud.setEndpoint('articles/originals');
    this.crud.httpGet(`?replicaId=${this.article.id}`).toPromise()
      .then(res => {
        if (res.response) {
          this.original = res.response;
          console.log('or', this.original);
        }
      });
  }

  async navigateToOriginal(): Promise<void> {
    if (this.article.originalFlag || !this.original.id) {
      return;
    }

    window.location.href = `articles/${this.original.id}`;
  }

  async navigateToReplica(): Promise<void> {
    if (!this.article.originalFlag || !this.replica.id) {
      return;
    }

    window.location.href = `articles/${this.replica.id}`;
  }
}
