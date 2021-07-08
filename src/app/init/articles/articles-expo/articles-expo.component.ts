import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../../services/crud.service';
import {IArticle} from '../../../core/Interfaces/IArticle';
import {LoaderService} from '../../../services/loader.service';
import {IUser} from '../../../core/Interfaces/IUser';
import {StorageService} from '../../../services/storage.service';

@Component({
  selector: 'app-articles-expo',
  templateUrl: './articles-expo.component.html',
  styleUrls: ['./articles-expo.component.scss']
})
export class ArticlesExpoComponent implements OnInit {

  private lineId: string | null;
  private materialId: string | null;
  private animeId: string | null;
  private brandId: string | null;
  private type: string | null;
  private search: string | null;
  maxPage: number;
  private query: string;
  pageNumber: number;
  count: number;
  articles: IArticle[];
  user: IUser;

  constructor(private route: ActivatedRoute,
              private crud: CrudService,
              private loader: LoaderService,
              private router: Router,
              private storage: StorageService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.query = '';
    this.lineId = null;
    this.materialId = null;
    this.animeId = null;
    this.brandId = null;
    this.type = null;
    this.search = null;
    this.articles = [];
    this.user = {};
    this.maxPage = 1;
    this.pageNumber = 1;
    this.count = 0;
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    this.lineId = this.route.snapshot.queryParamMap.get('lineId');
    this.materialId = this.route.snapshot.queryParamMap.get('materialId');
    this.animeId = this.route.snapshot.queryParamMap.get('animeId');
    this.brandId = this.route.snapshot.queryParamMap.get('brandId');
    this.type = this.route.snapshot.queryParamMap.get('type');
    this.search = this.route.snapshot.queryParamMap.get('search');

    await this.getUser();
    this.getArticles();
  }

  private getArticles(): void {
    this.loader.beginLoad();
    window.scroll(0, 0);
    this.buildQuery();
    this.crud.setEndpoint('articles' + this.query);
    this.crud.httpGet().toPromise()
      .then(res => {
        this.articles = res.response;
        this.pageNumber = res.page;
        this.maxPage = res.maxPage;
        this.count = res.count;
      })
      .finally(() => this.loader.endLoad());
  }

  private buildQuery(): void {
    this.query = `?page=${this.pageNumber}`;
    this.query += this.lineId ? `&lineId=${this.lineId}` : '';
    this.query += this.materialId ? `&materialId=${this.materialId}` : '';
    this.query += this.animeId ? `&animeId=${this.animeId}` : '';
    this.query += this.brandId ? `&brandId=${this.brandId}` : '';
    this.query += this.search ? `&search=${this.search}` : '';
    this.query += this.type ? `&type=${this.type}` : '';
  }

  async navigateToArticle(id: string): Promise<void> {
    await this.router.navigate([`articles/${id}`]);
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
    await this.crud.httpGet('', 'La sesión caduco').toPromise()
      .then(res => this.user = res.response)
      .catch(() => this.storage.deleteKey());
  }

  async next(): Promise<void> {
    if (this.pageNumber < this.maxPage) {
      this.pageNumber++;
      this.getArticles();
    }
  }

  async previous(): Promise<void> {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getArticles();
    }
  }
}
