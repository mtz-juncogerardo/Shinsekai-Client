import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {CartService} from '../../services/cart.service';
import {IArticle} from '../../core/Interfaces/IArticle';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit, OnDestroy {

  @Input() show: boolean;
  @Output() slideClose: EventEmitter<boolean>;
  subscription: Subscription;
  articles: IArticle[];
  subTotal: number;
  discount: number;
  total: number;

  constructor(private cart: CartService) {
    this.show = false;
    this.articles = [];
    this.total = 0;
    this.discount = 0;
    this.subTotal = 0;
    this.slideClose = new EventEmitter<boolean>();
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription = this.cart.cart$.subscribe(res => {
      this.articles = res;
      this.updateTotals();
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hideSlide(): void {
    this.show = false;
    this.slideClose.emit(this.show);
  }

  private updateTotals(): void {
    this.subTotal = 0;
    this.total = 0;
    this.discount = 0;
    this.articles.forEach(a => {
      if (a.price !== undefined && a.quantity !== undefined) {
        this.subTotal += (a.price * a.quantity);
      }
      if (a.discountPrice !== undefined) {
        this.discount += a.discountPrice;
      }
    });

    this.total = this.subTotal - this.discount;
  }

  deleteArticle(id: string): void {
    this.cart.removeProduct(id);
  }
}
