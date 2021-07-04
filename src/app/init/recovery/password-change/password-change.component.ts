import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../../services/crud.service';
import {AlertService} from '../../../services/alert.service';
import {LoaderService} from '../../../services/loader.service';
import {StorageService} from '../../../services/storage.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

  form: FormGroup;
  passwordMatch: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private crudService: CrudService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private loader: LoaderService,
              private storage: StorageService) {
    this.passwordMatch = true;
    this.form = this.formBuilder.group({
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

  async ngOnInit(): Promise<any> {
    if (this.storage.getKey()) {
      this.router.navigate(['/']);
    }
  }

  async submit(): Promise<void> {
    this.passwordMatch = true;

    if (this.form.invalid) {
      return;
    }

    if (this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.passwordMatch = false;
      return;
    }

    this.crudService.setBearer(this.route.snapshot.params.token);
    this.crudService.setEndpoint('auth/security');
    this.loader.beginLoad();

    await this.crudService.httpPut(this.form.value, 'El link es invalido o ya expiró').toPromise()
      .then(res => {
        if (res.response) {
          this.alertService.pushAlert({type: 'success', message: 'Ya puedes iniciar sesión con tu nueva contraseña'});
        }
      })
      .finally(() => {
        this.form.reset();
        this.loader.endLoad();
        this.router.navigate(['login']);
      });

  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  confirmPasswordFocus(): void {
    this.passwordMatch = true;
  }
}
