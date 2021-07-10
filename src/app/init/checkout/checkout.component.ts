import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {LoaderService} from '../../services/loader.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {IArticle} from '../../core/Interfaces/IArticle';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  articles: IArticle[];
  subscription: Subscription;
  total: number;

  constructor(private cart: CartService,
              private loader: LoaderService,
              private alert: AlertService,
              private router: Router,
              private crud: CrudService) {
    this.articles = [];
    this.subscription = new Subscription();
    this.total = 0;
  }

  ngOnInit(): void {
    window.document.body.style.overflowY = 'auto';
    this.getCartArticles();
  }

  private getCartArticles(): void {
    this.subscription = this.cart.cart$.subscribe(res => {
      this.articles = res;
      this.updateTotals();
    });
  }

  private updateTotals(): void {
    this.total = 0;
    this.articles.forEach(a => {
      if (a.price !== undefined && a.quantity !== undefined && a.discountPrice !== undefined) {
        this.total += (a.price - a.discountPrice) * (a.quantity);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
