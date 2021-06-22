import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../services/crud.service";
import {AlertService} from "../../services/alert.service";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  constructor(private crud: CrudService,
              private alert: AlertService,
              private loader: LoaderService) { }

  ngOnInit(): void {
    this.crud.setEndpoint('purchases/read');
    this.crud.httpGet().toPromise()
      .then(res => console.log(res.response));
  }

}
