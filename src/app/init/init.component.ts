import {Component, OnInit} from '@angular/core';
import {CrudService} from '../services/crud.service';
import {AlertService} from '../services/alert.service';
import {StorageService} from '../services/storage.service';
import {IUser} from '../core/Interfaces/IUser';
import {Router} from '@angular/router';
import {LoaderService} from '../services/loader.service';
import {IPromotions} from '../core/Interfaces/IPromotions';
import {IArticle} from '../core/Interfaces/IArticle';

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
  leftPromotions: IPromotions[];

  constructor(private alertService: AlertService,
              private storage: StorageService,
              private crud: CrudService,
              private router: Router,
              private loader: LoaderService) {
    this.user = {};
    this.selectedTab = 1;
    this.articlesBySales = [];
    this.articlesByNew = [];
    this.carousels = [];
    this.rightPromotions = [];
    this.leftPromotions = [];
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    await this.getCarousels();
    await this.getArticles();
    await this.getPromotions();
    await this.getUser();
  }

  private async getArticles(): Promise<void> {
    this.crud.setEndpoint('articles');

    await this.crud.httpGet(`?orderBySales=true`).toPromise()
      .then(res => this.articlesBySales = res.response);

    await this.crud.httpGet().toPromise()
      .then(res => this.articlesByNew = res.response);
  }

  private async getUser(): Promise<void> {
    const token = this.storage.getKey();

    if (!token || token.length < 50) {
      this.loader.endLoad();
      this.storage.deleteKey();
      return;
    }

    this.crud.setEndpoint('user');
    this.crud.setBearer(token);
    this.crud.httpGet('', 'La sesión caduco').toPromise()
      .then(res => this.user = res.response)
      .catch(() => this.storage.deleteKey())
      .finally(() => {
        console.log(this.user);
        this.loader.endLoad();
      });
  }

  private async getCarousels(): Promise<void> {
    this.crud.setEndpoint('carousels/read');
    await this.crud.httpGet().toPromise()
      .then(res => this.carousels = res.response);
  }

  navigateTo(path: string = ''): void {
    if (!path) {
      return;
    }

    window.location.href = path;
  }

  changeTab(tab: 1 | 2): void {
    this.selectedTab = tab;
  }

  async navigateToArticle(id: string): Promise<void> {
    console.log('article', id);
    await this.router.navigate([`articles/${id}`]);
  }

  private async getPromotions(): Promise<void> {
    this.crud.setEndpoint('promotions/read');
    await this.crud.httpGet().toPromise()
      .then(res => {
        if (res.response) {
          this.rightPromotions = res.response.filter((p: IPromotions) => p.appearsOnRight);
          this.leftPromotions = res.response.filter((p: IPromotions) => p.appearsOnLeft);
        }
      });
  }
}
