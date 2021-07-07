import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IArticle} from '../core/Interfaces/IArticle';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: BehaviorSubject<IArticle[]>;
  private articles: IArticle[];
  cart$: Observable<IArticle[]>;

  constructor() {
    this.cart = new BehaviorSubject<IArticle[]>([]);
    this.cart$ = this.cart.asObservable();
    this.articles = [];
  }

  addToCart(article: IArticle): void {
    this.articles.push(article);
    this.cart.next(this.articles);
  }

  removeProduct(id: string): void {
    this.articles = this.articles.filter(a => a.id !== id);
    this.cart.next(this.articles);
  }

  articleExists(id: string): boolean {
    return this.articles.some(a => a.id === id);
  }
}
