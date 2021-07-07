import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IArticle} from '../core/Interfaces/IArticle';

@Injectable({
  providedIn: 'root'
})
export class ArticleCacheService {

  articlesSetNew: IArticle[];
  articlesSetSales: IArticle[];

  constructor() {
    this.articlesSetNew = [];
    this.articlesSetSales = [];
  }
}
