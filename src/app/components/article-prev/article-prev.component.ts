import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-article-prev',
  templateUrl: './article-prev.component.html',
  styleUrls: ['./article-prev.component.scss']
})
export class ArticlePrevComponent implements OnInit {

  @Input() image: string;
  @Input() price: number;
  @Input() discountPrice: number;
  @Input() stock: number | undefined;
  @Input() name: string;
  @Input() big: boolean;
  @Output() articleClick: EventEmitter<any>;

  constructor() {
    this.image = '';
    this.big = false;
    this.price = 0;
    this.stock = 0;
    this.discountPrice = 0;
    this.name = '';
    this.articleClick = new EventEmitter<any>();
  }

  ngOnInit(): void {
  }


  emitArticleClick(): void {
    this.articleClick.emit();
  }
}
