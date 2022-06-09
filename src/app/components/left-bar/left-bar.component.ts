import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IPromotions} from '../../core/Interfaces/IPromotions';
import {CrudService} from '../../services/crud.service';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent implements OnInit {

  leftPromotions: IPromotions[];

  constructor(private router: Router,
              private crud: CrudService) {
    this.leftPromotions = [];
  }

  async ngOnInit(): Promise<void> {
    await this.getPromotions();
  }

  async navigateToOriginalReplica(type: string): Promise<void> {
    if (!type) {
      return;
    }

    await this.router.navigate(['articles'], {queryParams: {type}});
  }

  private async getPromotions(): Promise<void> {
    this.crud.setEndpoint('promotions/read');
    await this.crud.httpGet().toPromise()
      .then(res => {
        if (res.response) {
          this.leftPromotions = res.response.filter((p: IPromotions) => p.appearsOnLeft);
        }
      });
  }

  navigateTo(path: string = ''): void {
    if (!path) {
      return;
    }

    window.location.href = path;
  }
}
