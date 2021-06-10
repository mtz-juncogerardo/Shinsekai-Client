import {Component, OnInit} from '@angular/core';
import {CrudService} from '../services/crud.service';
import {AlertService} from '../services/alert.service';
import {StorageService} from '../services/storage.service';
import {IUser} from '../core/Interfaces/IUser';
import {Router} from '@angular/router';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  user: IUser;

  constructor(private alertService: AlertService,
              private storage: StorageService,
              private crud: CrudService,
              private router: Router,
              private loader: LoaderService) {
    this.user = {};
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    await this.getUser();
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
    this.crud.httpGet().toPromise()
      .then(res => this.user = res.response)
      .catch(() => this.storage.deleteKey())
      .finally(() => this.loader.endLoad());
  }

  signOut(): void {
    this.storage.deleteKey();
    location.reload();
  }

  toggleCart(): void {
    console.log('openslide');
  }

  async goToAccount(): Promise<void> {
    if (Object.keys(this.user).length > 0) {
      await this.router.navigate(['/account']);
      return;
    }

    await this.router.navigate(['/login']);
  }

  async goToAdminPanel(): Promise<void> {
    await this.router.navigate(['/admin']);
  }
}
