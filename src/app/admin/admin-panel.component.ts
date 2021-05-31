import {Component, OnInit} from '@angular/core';
import {CrudService} from '../services/crud.service';
import {StorageService} from '../services/storage.service';
import {Router} from '@angular/router';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  private jwt: string;
  private authorize: boolean;
  search: boolean;
  currentMenu: string;
  menuItems: string[];

  constructor(private crud: CrudService,
              private storage: StorageService,
              private router: Router,
              private alert: AlertService,
              private loader: LoaderService) {
    this.jwt = '';
    this.authorize = false;
    this.search = false;
    this.menuItems = [
      'Articulos',
      'Usuarios',
      'Promociones',
      'Carrusel',
      'Compras',
      'Info General'
    ];
    this.currentMenu = this.menuItems[0];
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    this.jwt = this.storage.getKey();

    if (!this.jwt) {
      this.loader.endLoad();
      await this.negateAccess();
    }

    await this.validateAdminRol()
      .then(() => this.authorize = true)
      .finally(() => {
        this.loader.endLoad();
        if (!this.authorize) {
          this.negateAccess();
        }
      });
  }

  private async negateAccess(): Promise<void> {
    this.alert.pushAlert({type: 'danger', message: 'No tienes permiso para acceder a la pagina'});
    await this.router.navigate(['/']);
  }

  private async validateAdminRol(): Promise<any> {
    this.crud.setEndpoint('auth/admin');
    this.crud.setBearer(this.jwt);
    return this.crud.httpGet().toPromise();
  }

  submitSearch(): void {

  }

  selectMenu(menuIndex: number): void {
    this.currentMenu = this.menuItems[menuIndex];
  }
}
