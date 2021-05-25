import {Component, OnInit} from '@angular/core';
import {CrudService} from '../services/crud.service';
import {AlertService} from '../services/alert.service';
import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  user: any;

  constructor(private alertService: AlertService,
              private storage: StorageService,
              private crud: CrudService) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  private getUser(): void {
    const token = this.storage.getKey();

    if (!token || token.length < 50) {
      return;
    }

    this.crud.setEndpoint('user');
    this.crud.setBearer(token);
    console.log(token);
    this.crud.httpGet().toPromise()
      .then(res => this.user = res.response);
  }

  signOut(): void {
    this.storage.deleteKey();
    location.reload();
  }
}
