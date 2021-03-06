import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../services/alert.service';
import {LoaderService} from '../../services/loader.service';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  passwordMatch: boolean;
  emailMatch: boolean;

  constructor(private router: Router,
              private crudService: CrudService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private loader: LoaderService,
              private storage: StorageService) {
    this.crudService.setEndpoint('auth/signup');
    this.passwordMatch = true;
    this.emailMatch = true;
    this.form = this.formBuilder.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
        ])
      ],
      confirmEmail: [
        null,
        Validators.required
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

  async ngOnInit(): Promise<any> {
    if (this.storage.getKey()) {
      this.router.navigate(['/']);
    }
  }

  async submit(): Promise<void> {
    this.emailMatch = true;
    this.passwordMatch = true;

    if (this.form.invalid) {
      return;
    }

    if (this.form.get('email')?.value !== this.form.get('confirmEmail')?.value) {
      console.log(this.form.get('email')?.value);
      console.log(this.form.get('confirmEmail')?.value);
      this.emailMatch = false;
      return;
    }

    if (this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.passwordMatch = false;
      return;
    }

    this.loader.beginLoad();

    await this.crudService.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.alertService.pushAlert({
            type: 'success',
            message: 'Se ha enviado un correo al email proporcionado, abre el link para confirmar tu registro'
          });
        }
      })
      .finally(() => {
        this.form.reset();
        this.loader.endLoad();
      });

  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  confirmPasswordFocus(): void {
    this.passwordMatch = true;
  }

  confirmEmailFocus(): void {
    this.emailMatch = true;
  }
}
