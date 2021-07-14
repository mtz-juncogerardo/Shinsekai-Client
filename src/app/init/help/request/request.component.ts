import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CrudService} from '../../../services/crud.service';
import {LoaderService} from '../../../services/loader.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private crud: CrudService,
              private loader: LoaderService,
              private alert: AlertService) {
    this.form = this.formBuilder.group({
      purchaseId: [null, Validators.compose([Validators.required, Validators.maxLength(36), Validators.minLength(36)])],
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      message: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loader.beginLoad();
    this.crud.setEndpoint('request');
    this.crud.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.alert.pushAlert({type: 'success', message: res.response});
        }
      })
      .finally(() => this.loader.endLoad());
  }
}
