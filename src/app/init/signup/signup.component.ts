import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  loading: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private crudService: CrudService,
              private formBuilder: FormBuilder,
              private alertService: AlertService) {
    this.crudService.setEndpoint('auth/signup');
    this.loading = false;
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
      confirmPassword: [
        null,
        Validators.required
      ]
    });
  }

  async ngOnInit(): Promise<any> {

  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      return;
    }

    this.loading = true;

    await this.crudService.httpPost(this.form.value).toPromise()
      .then(() => {
        this.alertService.pushAlert({
          type: 'success',
          message: 'Se ha enviado un correo al email proporcionado, abre el link para confirmar tu registro'
        });
      });

    this.form.reset();
    this.loading = false;
  }
}
