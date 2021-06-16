import {Component, OnInit} from '@angular/core';
import {ITag} from '../../core/Interfaces/ITag';
import {CrudService} from '../../services/crud.service';
import {AlertService} from '../../services/alert.service';
import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  tags: ITag[];
  selectedTag: ITag;
  material: boolean;
  line: boolean;
  anime: boolean;
  brand: boolean;

  constructor(private crud: CrudService,
              private alert: AlertService,
              private loader: LoaderService) {
    this.crud.setEndpoint('tags');
    this.tags = [];
    this.selectedTag = { id: '', name: ''};
    this.material = false;
    this.line = false;
    this.anime = false;
    this.brand = true;
  }

  ngOnInit(): void {
    this.getTags();
  }

  getTags(): void {
    this.loader.beginLoad();
    this.crud.setEndpoint('tags');
    const query = `?byAnime=${this.anime.toString()}&byMaterial=${this.material.toString()}&byLine=${this.line.toString()}&byBrand=${this.brand.toString()}`;

    this.crud.httpGet(query).toPromise()
      .then(res => this.tags = res.response)
      .finally(() => this.loader.endLoad());
  }

  setTag(tag: ITag): void {
    this.selectedTag = tag;
  }

  delete(): void {
    this.loader.beginLoad();
    const endpoint = `tags/${this.selectedTag.type?.toLowerCase()}`;
    this.crud.setEndpoint(endpoint);

    this.crud.httpDelete(`?id=${this.selectedTag.id}`).toPromise()
      .then(res => {
        if (res.response) {
          this.tags = this.tags.filter(t => t.id !== this.selectedTag.id);
          this.alert.pushAlert({type: 'success', message: 'El tag se elimino con exito'});
        }
      })
      .finally(() => this.loader.endLoad());
  }
}
