import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {LoaderService} from '../../services/loader.service';
import {CrudService} from '../../services/crud.service';
import {IUser} from '../../core/Interfaces/IUser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pre-checkout',
  templateUrl: './pre-checkout.component.html',
  styleUrls: ['./pre-checkout.component.scss']
})
export class PreCheckoutComponent implements OnInit {

  user: IUser;
  form: FormGroup;


  constructor(private storage: StorageService,
              private formBuilder: FormBuilder,
              private loader: LoaderService,
              private crud: CrudService,
              private router: Router) {
    this.user = {};
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, Validators.compose([Validators.required, Validators.maxLength(36)])],
      address: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      city: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      phone: [null, Validators.compose([Validators.required, Validators.maxLength(12), Validators.minLength(10), Validators.pattern('^[0-9]*$')])],
      postalCode: [null, Validators.compose([Validators.required, Validators.maxLength(5), Validators.minLength(5), Validators.pattern('^[0-9]*$')])],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
        ])
      ],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    window.document.body.style.overflowY = 'auto';
    await this.getUser();
    if (this.user?.address && this.user?.city && this.user?.postalCode && this.user?.phone && this.user?.name && this.user?.email) {
      this.router.navigate(['checkout'])
        .finally(() => this.loader.endLoad());
      return;
    }
    this.form.patchValue({
      id: this.user?.id !== undefined ? this.user.id : null,
      name: this.user?.name !== undefined ? this.user.name : null,
      phone: this.user?.phone !== undefined ? this.user.phone : null,
      email: this.user?.email !== undefined ? this.user.email : null,
      city: this.user?.city !== undefined ? this.user.city : null,
      address: this.user?.address !== undefined ? this.user.address : null,
      postalCode: this.user?.postalCode !== undefined ? this.user.postalCode : null,
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
      .then(res => this.user = res.response)
      .catch(() => this.storage.deleteKey());
    this.loader.endLoad();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    this.loader.beginLoad();
    if (this.form.value.id) {
      console.log('compra no anonima');
      await this.crud.httpPut(this.form.value).toPromise()
        .then(res => {
          if (res.response) {
            this.router.navigate(['checkout']);
          }
        }).finally(() => this.loader.endLoad());

      return;
    }

    console.log('compra ANONIMA');
    this.crud.setEndpoint('auth/authorize');
    await this.crud.httpPost(this.form.value).toPromise()
      .then(res => this.storage.set('sh-anon', res.response))
      .finally(() => {
        this.router.navigate(['checkout']);
        this.loader.endLoad();
      });
  }
}
