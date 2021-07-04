import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoaderService} from '../../services/loader.service';
import {AlertService} from '../../services/alert.service';
import {CrudService} from '../../services/crud.service';
import {Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {

  form: FormGroup;
  emailMatch: boolean;
  done: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private loader: LoaderService,
              private alert: AlertService,
              private crud: CrudService,
              private storage: StorageService) {
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
      ]
    });

    this.emailMatch = true;
    this.done = false;
  }

  ngOnInit(): void {
    if (this.storage.getKey()) {
      this.router.navigate(['/']);
    }
  }

  async submit(): Promise<void> {
    this.emailMatch = true;

    if (this.form.invalid) {
      return;
    }

    if (this.form.get('email')?.value !== this.form.get('confirmEmail')?.value) {
      this.emailMatch = false;
      return;
    }

    this.loader.beginLoad();
    this.crud.setEndpoint('auth/recover');

    await this.crud.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.done = true;
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

  confirmEmailFocus(): void {
    this.emailMatch = true;
  }
}
