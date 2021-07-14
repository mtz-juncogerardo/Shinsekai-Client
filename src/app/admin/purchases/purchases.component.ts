import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {LoaderService} from '../../services/loader.service';
import {IPurchase} from '../../core/Interfaces/IPurchase';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  purchases: IPurchase[];
  selectedPurchase: IPurchase;
  searchPurchase: string;

  constructor(private crud: CrudService,
              private loader: LoaderService,
              private alert: AlertService) {
    this.purchases = [];
    this.selectedPurchase = {};
    this.searchPurchase = '';
  }

  ngOnInit(): void {
    this.loader.beginLoad();
    this.crud.setEndpoint('purchases/read');
    this.crud.httpGet().toPromise()
      .then(res => {
        this.purchases = res.response;
        this.purchases.forEach(item => {
          item.purchaseDate = item.purchaseDate !== undefined ? new Date(item.purchaseDate.toLocaleString()).toString() : '10-09-1992';
        });
      })
      .finally(() => this.loader.endLoad());
  }

  setPurchase(purchase: IPurchase): void {
    this.selectedPurchase = purchase;
  }

  searchPurchases(event: any = null): void {
    if (event && event.keyCode !== 13) {
      return;
    }

    if (this.searchPurchase.length !== 36) {
      this.alert.pushAlert({type: 'danger', message: 'El id que ingresaste no es valido'});
    }

    this.loader.beginLoad();
    this.crud.setEndpoint('purchases/read?id=' + this.searchPurchase);
    this.crud.httpGet().toPromise()
      .then(res => {
        if (res.response) {
          this.purchases = [];
          this.purchases.push(res.response);
          console.log(res.response);
        }
      }).finally(() => this.loader.endLoad());
  }
}
