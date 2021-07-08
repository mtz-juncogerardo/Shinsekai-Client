import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {LoaderService} from '../../services/loader.service';
import {IQuestion} from '../../core/Interfaces/IQuestion';
import {IUser} from '../../core/Interfaces/IUser';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  questions: IQuestion[];
  user: IUser;

  constructor(private crud: CrudService,
              private loader: LoaderService,
              private storage: StorageService) {
    this.questions = [];
    this.user = {};
  }

  async ngOnInit(): Promise<void> {
    this.getUser();
    await this.getQuestions();
  }

  private async getQuestions(): Promise<void> {
    this.loader.beginLoad();
    this.crud.setEndpoint('admin/questions/read');
    await this.crud.httpGet().toPromise()
      .then(res => this.questions = res.response)
      .finally(() => this.loader.endLoad());
  }

  private getUser(): void {
    const token = this.storage.getKey();

    if (!token || token.length < 50) {
      this.loader.endLoad();
      this.storage.deleteKey();
      return;
    }

    this.crud.setEndpoint('user');
    this.crud.setBearer(token);
    this.crud.httpGet('', 'La sesión caduco').toPromise()
      .then(res => this.user = res.response)
      .catch(() => this.storage.deleteKey());
  }
}
