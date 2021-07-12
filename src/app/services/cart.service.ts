import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IArticle} from '../core/Interfaces/IArticle';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: BehaviorSubject<IArticle[]>;
  articles: IArticle[];
  cart$: Observable<IArticle[]>;

  constructor(private storage: StorageService) {
    this.articles = JSON.parse(this.storage.get('sh-cart')) || [];
    this.cart = new BehaviorSubject<IArticle[]>(this.articles);
    this.cart$ = this.cart.asObservable();
    console.log('storage', this.articles);
  }

  addToCart(article: IArticle): void {
    this.articles.push(article);
    this.storage.delete('sh-cart');
    this.storage.set('sh-cart', JSON.stringify(this.articles));
    this.cart.next(this.articles);
  }

  removeProduct(id: string): void {
    this.articles = this.articles.filter(a => a.id !== id);
    this.storage.delete('sh-cart');
    this.storage.set('sh-cart', JSON.stringify(this.articles));
    this.cart.next(this.articles);
  }

  clearCart(): void {
    this.cart.next([]);
  }

  articleExists(id: string): boolean {
    return this.articles.some(a => a.id === id);
  }
}
