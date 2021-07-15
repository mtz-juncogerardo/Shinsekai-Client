import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {StorageService} from '../../services/storage.service';
import {IUser} from '../../core/Interfaces/IUser';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';
import {IArticle} from '../../core/Interfaces/IArticle';
import {IPoint} from '../../core/Interfaces/IPoint';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user: IUser;
  favorites: IArticle[];
  points: IPoint;
  form: FormGroup;
  passwordForm: FormGroup;
  passwordMatch: boolean;
  purchases: any[];
  selectedMenu: 'favorite' | 'purchases' | 'config';

  constructor(private formBuilder: FormBuilder,
              private crud: CrudService,
              private storage: StorageService,
              private router: Router,
              private loader: LoaderService,
              private alert: AlertService) {
    this.user = {};
    this.purchases = [];
    this.passwordMatch = false;
    this.favorites = [];
    this.points = {totalExpired: 0, totalValid: 0};
    this.selectedMenu = 'config';
    this.form = this.formBuilder.group({
      email: [null],
      name: [null, Validators.compose([Validators.required, Validators.maxLength(36)])],
      address: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      city: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      phone: [null, Validators.compose([Validators.required, Validators.maxLength(12), Validators.minLength(10), Validators.pattern('^[0-9]*$')])],
      postalCode: [null, Validators.compose([Validators.required, Validators.maxLength(5), Validators.minLength(5), Validators.pattern('^[0-9]*$')])],
    });

    this.passwordForm = this.formBuilder.group({
      previousPassword: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}$')
        ])
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}$')
        ])
      ],
      confirmPassword: [
        null,
        Validators.required
      ]
    });
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    await this.getUser();
    await this.getFavorites();
    await this.getPoints();
    await this.getPurchases();
    this.loader.endLoad();
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

    this.form.reset(this.user);
  }

  async logout(): Promise<void> {
    this.storage.deleteKey();
    await this.router.navigate(['/']);
  }

  private async getFavorites(): Promise<void> {
    this.crud.setEndpoint('user/favorites');
    await this.crud.httpGet().toPromise()
      .then(res => this.favorites = res.response);
  }

  private async getPoints(): Promise<void> {
    this.crud.setEndpoint('user/points');
    await this.crud.httpGet().toPromise()
      .then(res => this.points = res.response);
  }

  async passwordSubmit(): Promise<void> {
    if (this.passwordForm.invalid || !this.passwordMatch) {
      return;
    }

    this.loader.beginLoad();
    let correctPrevPassword = false;
    const auth = {
      email: this.user.email,
      password: this.passwordForm.value.previousPassword,
    };

    this.crud.setEndpoint('auth/login');
    await this.crud.httpPost(auth, 'Tu contraseña es incorrecta').toPromise()
      .then(res => {
        if (res.response) {
          correctPrevPassword = true;
        }
      }).finally(() => this.loader.endLoad());

    if (!correctPrevPassword) {
      this.loader.endLoad();
      return;
    }

    this.crud.setEndpoint('auth/security');
    await this.crud.httpPut(this.passwordForm.value).toPromise()
      .then(res => {
        if (res.response) {
          this.alert.pushAlert({type: 'success', message: 'Cambiaste tu contraseña!'});
          this.passwordForm.reset();
        }
      });

    this.loader.endLoad();
  }

  confirmPasswordFocus(): void {
    if (this.passwordForm.value.confirmPassword === this.passwordForm.value.password) {
      this.passwordMatch = true;
      return;
    }

    this.passwordMatch = false;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.form.value.city === this.user.city
      && this.form.value.phone === this.user.phone
      && this.form.value.postalCode === this.user.postalCode
      && this.form.value.address === this.user.address
      && this.form.value.name === this.user.name) {
      return;
    }

    this.loader.beginLoad();
    this.form.value.email = this.user.email;
    this.crud.setEndpoint('user');
    this.crud.httpPut(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.user = res.response;
          this.alert.pushAlert({type: 'success', message: 'Actualizaste tus datos!'});
        }
      })
      .finally(() => this.loader.endLoad());
  }

  changeTab(tab: 'favorite' | 'purchases' | 'config'): void {
    this.selectedMenu = tab;
  }

  private async getPurchases(): Promise<void> {
    this.crud.setEndpoint('user/purchases');
    await this.crud.httpGet().toPromise().then(res => this.purchases = res.response);
  }
}
