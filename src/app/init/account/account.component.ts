import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {StorageService} from '../../services/storage.service';
import {IUser} from '../../core/Interfaces/IUser';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user: IUser;

  constructor(private crud: CrudService,
              private storage: StorageService,
              private router: Router) {
    this.crud.setEndpoint('user');
    this.crud.setBearer(this.storage.getKey());
    this.user = {};
  }

  ngOnInit(): void {
    this.crud.httpGet().toPromise()
      .then(res => {
        this.user = res.response;
      });
  }

  logout(): void {
    this.storage.deleteKey();
    this.router.navigate(['/']);
  }
}
