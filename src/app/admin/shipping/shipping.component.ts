import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {AlertService} from '../../services/alert.service';
import {LoaderService} from '../../services/loader.service';
import {IShipping} from '../../core/Interfaces/IShipping';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {

  deliveries: IShipping[];
  form: FormGroup;
  selectedDelivery: IShipping;
  editFlag: boolean;

  constructor(private crud: CrudService,
              private formBuilder: FormBuilder,
              private loader: LoaderService,
              private alert: AlertService) {
    this.deliveries = [];
    this.editFlag = false;
    this.selectedDelivery = {};
    this.form = this.formBuilder.group({
      id: [null],
      parcel: [null, Validators.required],
      estimatedDays: [10, Validators.required],
      location: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loader.beginLoad();
    this.crud.setEndpoint('delivery/read');
    this.getShipping();
  }

  private getShipping(): void {
    this.crud.httpGet().toPromise()
      .then(res => this.deliveries = res.response)
      .finally(() => this.loader.endLoad());
  }

  cleanForms(): void {
    this.form.reset();
    this.editFlag = false;
  }

  update(shipping: IShipping): void {
    this.editFlag = true;

    this.form.patchValue({
      id: shipping?.id,
      parcel: shipping?.parcel,
      estimatedDays: shipping?.estimatedDays,
      location: shipping?.location
    });
  }

  setShipping(shipping: IShipping): void {
    this.selectedDelivery = shipping;
  }

  delete(): void {
    this.loader.beginLoad();
    this.crud.setEndpoint('delivery');
    this.crud.httpDelete(`?id=${this.selectedDelivery.id}`).toPromise()
      .then(res => {
        if (res.response) {
          this.deliveries = this.deliveries.filter(q => q.id !== this.selectedDelivery.id);
          this.alert.pushAlert({type: 'success', message: 'El tiempo de entrega se elimino con exito'});
        }
      })
      .finally(() => this.loader.endLoad());
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loader.beginLoad();

    if (this.editFlag) {
      this.crud.setEndpoint('delivery/update');
      this.crud.httpPut(this.form.value).toPromise()
        .then(res => {
          if (res.response) {
            this.deliveries = this.deliveries.map(d => d.id === res.response.id ? res.response : d);
            this.alert.pushAlert({type: 'success', message: 'La fecha de entrega se actualizo con exito'});
            this.cleanForms();
          }
        })
        .finally(() => this.loader.endLoad());

      return;
    }

    this.crud.setEndpoint('delivery/create');
    this.crud.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.deliveries.unshift(res.response);
          this.alert.pushAlert({type: 'success', message: 'La fecha de entrega se creo con exito'});
          this.cleanForms();
        }
      })
      .finally(() => this.loader.endLoad());
  }
}
