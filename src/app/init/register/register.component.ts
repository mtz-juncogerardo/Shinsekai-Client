import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {AlertService} from '../../services/alert.service';
import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  token: string;

  constructor(private crudService: CrudService,
              private router: Router,
              private route: ActivatedRoute,
              private storage: StorageService,
              private alertService: AlertService,
              private loader: LoaderService) {
    this.crudService.setEndpoint('auth/register');
    this.token = '';
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(param => this.token = param.token);
    if (this.token) {
      this.crudService.setBearer(this.token);
      this.loader.beginLoad();
      await this.crudService.httpPost(null).toPromise()
        .then(res => {
          if (res.response) {
            const token = res.response;
            console.log('tkk', res.response);
            this.storage.setKey(token);
            this.alertService.pushAlert({type: 'success', message: 'Tu registro se completo correctamente'});
          }
        });

      this.loader.endLoad();
      await this.router.navigate(['/']);
    }
  }
}
