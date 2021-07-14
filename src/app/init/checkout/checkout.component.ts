import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {LoaderService} from '../../services/loader.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {IArticle} from '../../core/Interfaces/IArticle';
import {Subscription} from 'rxjs';
import {IPaymentRequest} from '../../core/Interfaces/IPayment';
import {environment} from '../../../environments/environment';
import {StorageService} from '../../services/storage.service';
import {IUser} from '../../core/Interfaces/IUser';
import {IPoint} from '../../core/Interfaces/IPoint';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  articles: IArticle[];
  subscription: Subscription;
  payWithPoints: boolean;
  pendingPoints: number;
  user: IUser;
  total: number;
  points: IPoint;
  cartEdit: boolean;

  constructor(private cart: CartService,
              private loader: LoaderService,
              private alert: AlertService,
              private router: Router,
              private crud: CrudService,
              private storage: StorageService) {
    this.articles = [];
    this.points = {totalExpired: 0, totalValid: 0};
    this.user = {};
    this.cartEdit = false;
    this.subscription = new Subscription();
    this.payWithPoints = false;
    this.pendingPoints = 0;
    this.total = 0;
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    const anonKey = this.storage.get('sh-anon');
    if (!anonKey) {
      await this.getUser();
      await this.getPoints();
    } else {
      this.crud.setBearer(anonKey);
    }

    if (!anonKey && (
      !this.user.name ||
      !this.user.city ||
      !this.user.postalCode ||
      !this.user.city ||
      !this.user.address ||
      !this.user.phone)) {
      await this.router.navigate(['pre-checkout'])
        .finally(() => this.loader.endLoad());
      return;
    }

    window.document.body.style.overflowY = 'auto';
    this.getCartArticles();
    this.loader.endLoad();
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
      .then(res => {
        if (res.error) {
          this.user = {};
          return;
        }
        this.user = res.response;
      })
      .catch(() => this.storage.deleteKey());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  pay(): void {
    if (this.articles.length === 0) {
      return;
    }
    this.loader.beginLoad();
    const payment: IPaymentRequest = {
      articles: this.articles,
      errorUrl: environment.errorUrl,
      payWithPoints: this.payWithPoints,
      successUrl: environment.successUrl
    };

    this.crud.setEndpoint('purchases/checkout');
    this.crud.httpPost(payment).toPromise().then(res => {
      this.storage.set('sh-pay', JSON.stringify(res.response));
      window.location.replace(res.response.sessionUrl);
    })
      .finally(() => this.loader.endLoad());
  }

  openCart(): void {
    this.cartEdit = true;
  }

  cartClosed(): void {
    this.cartEdit = false;
  }

  private async getPoints(): Promise<void> {
    this.crud.setEndpoint('user/points');
    await this.crud.httpGet().toPromise()
      .then(res => {
        if (res.response) {
          this.points = res.response;
        }
      });
  }

  togglePayPoints(): void {
    if (this.payWithPoints) {
      const pointsAfterDiscount = this.total - this.points.totalValid;
      this.pendingPoints = this.points.totalValid;

      if (pointsAfterDiscount < 0) {
        this.points.totalValid = pointsAfterDiscount * -1;
        this.total = 0;
      } else {
        this.total -= this.points.totalValid;
        this.points.totalValid = 0;
      }
      return;
    }

    this.updateTotals();
    this.points.totalValid = this.pendingPoints;
  }
}
