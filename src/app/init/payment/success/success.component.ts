import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../../services/crud.service';
import {CartService} from '../../../services/cart.service';
import {LoaderService} from '../../../services/loader.service';
import {IUser} from '../../../core/Interfaces/IUser';
import {StorageService} from '../../../services/storage.service';
import {IArticle} from '../../../core/Interfaces/IArticle';
import {Router} from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  purchase: any;
  user: IUser;
  articles: IArticle[];
  paymentValid: boolean;
  purchaseId: string;
  cashPoints: number;
  totalAmount: number;

  constructor(private crud: CrudService,
              private cart: CartService,
              private loader: LoaderService,
              private storage: StorageService,
              private router: Router) {
    this.purchase = {};
    this.purchaseId = '';
    this.paymentValid = false;
    this.user = {};
    this.articles = [];
    this.cashPoints = 0;
    this.totalAmount = 0;
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    const anonToken = this.storage.get('sh-anon');
    const token = anonToken ? anonToken : this.storage.getKey();

    this.crud.setBearer(token);

    await this.checkPayment();

    this.setPurchase();

    if (this.paymentValid) {
      await this.savePayment();
    } else {
      await this.router.navigate(['payment/error']);
    }

    this.loader.endLoad();
  }

  private setPurchase(): void {
    const purchasesArticles = [{}];
    purchasesArticles.pop();

    this.articles.forEach(a => {
      purchasesArticles.push({
        articleId: a.id,
        quantity: a.quantity
      });
    });

    this.purchase = {
      purchasesArticles,
      cashPoints: this.cashPoints
    };
  }

  private async checkPayment(): Promise<void> {
    const payment = JSON.parse(this.storage.get('sh-pay')) || null;
    this.storage.delete('sh-pay');

    if (payment === null) {
      await this.router.navigate(['/']);
      this.loader.endLoad();
      return;
    }

    this.articles = payment.articles;
    this.cashPoints = payment.cashPoints;
    this.crud.setEndpoint('purchases/validate');
    await this.crud.httpGet(`?paymentId=${payment.id}`)
      .toPromise()
      .then(async (res) => {
        if (res.response.payment_status !== 'paid') {
          await this.router.navigate(['/']);
          return;
        }

        this.paymentValid = true;
      });
  }

  private async savePayment(): Promise<void> {
    this.crud.setEndpoint('purchases/create');
    await this.crud.httpPost(this.purchase).toPromise()
      .then(res => {
        this.user.name = res.response.name;
        this.user.address = res.response.address;
        this.user.city = res.response.city;
        this.user.postalCode = res.response.postalCode;
        this.purchaseId = res.response.id;
        this.totalAmount = res.response.totalAmount;
      })
      .finally(() => {
        this.cart.clearCart();
        this.storage.delete('sh-cart');
        this.storage.delete('sh-anon');
      });
  }
}
