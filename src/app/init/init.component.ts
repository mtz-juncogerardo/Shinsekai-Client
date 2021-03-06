import {Component, OnInit} from '@angular/core';
import {CrudService} from '../services/crud.service';
import {AlertService} from '../services/alert.service';
import {StorageService} from '../services/storage.service';
import {IUser} from '../core/Interfaces/IUser';
import {Router} from '@angular/router';
import {LoaderService} from '../services/loader.service';
import {IPromotions} from '../core/Interfaces/IPromotions';
import {IArticle} from '../core/Interfaces/IArticle';
import {ArticleCacheService} from '../services/article-cache.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  user: IUser;
  carousels: IPromotions[];
  articlesBySales: IArticle[];
  articlesByNew: IArticle[];
  selectedTab: 1 | 2;
  rightPromotions: IPromotions[];

  constructor(private alertService: AlertService,
              private storage: StorageService,
              private crud: CrudService,
              private router: Router,
              private loader: LoaderService,
              private cache: ArticleCacheService) {
    this.user = {};
    this.selectedTab = 1;
    this.articlesBySales = [];
    this.articlesByNew = [];
    this.carousels = [];
    this.rightPromotions = [];
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    this.getUser();
    this.getPromotions();
    await this.getCarousels();
    await this.getArticles();
    this.loader.endLoad();
  }

  private async getArticles(): Promise<void> {
    this.crud.setEndpoint('articles');

    if (this.cache.articlesSetNew.length > 0 && this.cache.articlesSetSales.length > 0) {
      this.articlesBySales = this.cache.articlesSetSales;
      this.articlesByNew = this.cache.articlesSetNew;
      return;
    }

    await this.crud.httpGet(`?orderBySales=true`).toPromise()
      .then(res => {
        this.articlesBySales = res.response;
        this.cache.articlesSetSales = res.response;
      });

    console.log(this.articlesBySales);

    await this.crud.httpGet().toPromise()
      .then(res => {
        this.articlesByNew = res.response;
        this.cache.articlesSetNew = res.response;
      });
  }

  private getUser(): void {
    const token = this.storage.getKey();

    if (!token || token.length < 50) {
      this.loader.endLoad();
      this.storage.deleteKey();
      return;
    }

    this.crud.setEndpoint('user');
    this.crud.setBearer(token);
    this.crud.httpGet().toPromise()
      .then(res => {
        if (res.error) {
          this.alertService.pushAlert({type: 'danger', message: 'La sesi??n caduco'});
          this.storage.deleteKey();
          return;
        }
        this.user = res.response;
      }).catch(() => this.storage.deleteKey());
  }

  private async getCarousels(): Promise<void> {
    this.crud.setEndpoint('carousels/read');
    await this.crud.httpGet().toPromise()
      .then(res => this.carousels = res.response);
  }

  navigateTo(path: string = ''): void {
    console.log(path);
    if (!path) {
      return;
    }

    window.location.href = path;
  }

  changeTab(tab: 1 | 2): void {
    this.selectedTab = tab;
  }

  async navigateToArticle(id: string): Promise<void> {
    await this.router.navigate([`articles/${id}`]);
  }

  private getPromotions(): void {
    this.crud.setEndpoint('promotions/read');
    this.crud.httpGet().toPromise()
      .then(res => {
        if (res.response) {
          this.rightPromotions = res.response.filter((p: IPromotions) => p.appearsOnRight);
        }
      });
  }
}
