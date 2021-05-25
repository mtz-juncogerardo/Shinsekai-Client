import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  token: string;
  loading: boolean;

  constructor(private crudService: CrudService,
              private router: Router,
              private route: ActivatedRoute,
              private storage: StorageService,
              private alertService: AlertService) {
    this.crudService.setEndpoint('auth/register');
    this.token = '';
    this.loading = false;
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(param => this.token = param.token);
    if (this.token) {
      this.crudService.setBearer(this.token);
      this.loading = true;
      await this.crudService.httpPost(null).toPromise()
        .then(res => {
          const token = res.response;
          console.log('tkk', res.response);
          this.storage.setKey(token);
          this.alertService.pushAlert({type: 'success', message: 'Tu registro se completo correctamente'});
        });


      this.loading = false;
      this.router.navigate(['/']);
    }
  }
}
