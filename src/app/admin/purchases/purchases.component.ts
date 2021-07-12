import { Component, OnInit } from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {LoaderService} from '../../services/loader.service';
import {IPurchase} from '../../core/Interfaces/IPurchase';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  purchases: IPurchase[];
  selectedPurchase: IPurchase;

  constructor(private crud: CrudService,
              private loader: LoaderService) {
    this.purchases = [];
    this.selectedPurchase = {};
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
}
