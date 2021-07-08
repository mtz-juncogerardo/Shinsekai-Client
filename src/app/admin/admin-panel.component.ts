import {Component, OnInit} from '@angular/core';
import {CrudService} from '../services/crud.service';
import {StorageService} from '../services/storage.service';
import {Router} from '@angular/router';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {IResponse} from '../core/Interfaces/IResponse';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  private jwt: string;
  private authorize: boolean;
  search: string;
  currentMenu: string;
  menuItems: string[];
  articleResponse: IResponse;

  constructor(private crud: CrudService,
              private storage: StorageService,
              private router: Router,
              private alert: AlertService,
              private loader: LoaderService) {
    this.jwt = '';
    this.authorize = false;
    this.articleResponse = {
      page: 0,
      maxPage: 0,
      response: []
    };
    this.search = '';
    this.menuItems = [
      'Articulos',
      'Usuarios',
      'Tags',
      'Promocionales',
      'Carrusel',
      'Compras',
      'Tabla de Entregas',
      'Preguntas Frecuentes'
    ];
    this.currentMenu = this.menuItems[0];
  }

  async ngOnInit(): Promise<void> {
    this.loader.beginLoad();
    this.jwt = this.storage.getKey();

    if (!this.jwt) {
      await this.negateAccess();
    }

    await this.validateAdminRol()
      .then(res => {
        if (res.response) {
          this.authorize = true;
        }
      })
      .finally(() => {
        if (!this.authorize) {
          this.negateAccess();
        }
      });

    this.loader.endLoad();
  }

  private async negateAccess(): Promise<void> {
    this.loader.endLoad();
    this.alert.pushAlert({type: 'danger', message: 'No tienes permiso para acceder a la pagina'});
    await this.router.navigate(['/']);
  }

  private async validateAdminRol(): Promise<any> {
    this.crud.setEndpoint('auth/admin');
    this.crud.setBearer(this.jwt);
    return this.crud.httpGet().toPromise();
  }

  selectMenu(menuIndex: number): void {
    this.currentMenu = this.menuItems[menuIndex];
  }

  getArticles(response: IResponse): void {
    this.articleResponse = response;
  }

  saveSearch(search: string): void {
    this.search = search;
  }
}
