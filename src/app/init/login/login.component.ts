import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CrudService} from '../../services/crud.service';
import {AlertService} from '../../services/alert.service';
import {StorageService} from '../../services/storage.service';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private crudService: CrudService,
              private alertService: AlertService,
              private storage: StorageService,
              private router: Router,
              private loader: LoaderService) {
    this.crudService.setEndpoint('auth/login');
    this.form = this.formBuilder.group({
      email: [
        null,
        Validators.required
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16)
        ])
      ],
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.storage.getKey()) {
      await this.router.navigate(['/']);
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.alertService.pushAlert({type: 'danger', message: 'Credenciales incorrectas'});
    }

    this.loader.beginLoad();

    await this.crudService.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.storage.setKey(res.response);
          this.alertService.pushAlert({type: 'success', message: 'Te has logeado correctamente'});
          this.router.navigate(['/']);
          return;
        }
        this.storage.deleteKey();
      })
      .finally(() => this.loader.endLoad());
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
