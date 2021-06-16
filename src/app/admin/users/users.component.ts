import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {StorageService} from '../../services/storage.service';
import {AlertService} from '../../services/alert.service';
import {LoaderService} from '../../services/loader.service';
import {IUser} from '../../core/Interfaces/IUser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: IUser[];
  query: string;
  private selectedUser: IUser;

  constructor(private crud: CrudService,
              private storage: StorageService,
              private alert: AlertService,
              private loader: LoaderService) {
    this.crud.setEndpoint('admin/users');
    this.users = [];
    this.selectedUser = {};
    this.query = '';
  }

  ngOnInit(): void {
    this.loader.beginLoad();
    this.getUsers();
  }

  private getUsers(): void {
    this.crud.httpGet().toPromise()
      .then(res => this.users = res.response)
      .finally(() => this.loader.endLoad());
  }

  toggleAdmin(): void {
    this.selectedUser.admin = !this.selectedUser.admin;
    this.crud.httpPut(this.selectedUser).toPromise()
      .then(res => {
        if (res.response) {
          this.alert.pushAlert({type: 'success', message: res.response});
          this.users.map(u => u.id === this.selectedUser.id ? this.selectedUser : u);
        }
      });
  }

  setUser(user: IUser, event: any): void {
    event.preventDefault();
    this.selectedUser = user;

    if (this.selectedUser.admin) {
      this.query = `Estas a punto de retirarle a ${user.name ? user.name : user.email} sus permisos para administrar la tienda.`;
      return;
    }

    this.query = `Estas a punto de darle permisos de administrador a ${user.name ? user.name : user.email}`;
  }
}
