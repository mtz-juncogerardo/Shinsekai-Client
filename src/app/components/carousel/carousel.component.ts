import {Component, Input, OnInit} from '@angular/core';
import {IArticle} from '../../core/Interfaces/IArticle';
import {Router} from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input() articles: IArticle[];

  constructor(private router: Router) {
    this.articles = [];
  }

  ngOnInit(): void {
  }

  slideCarousel(direction: 'left' | 'right'): void {
    const carousel = document.getElementById('c_scroll');
    const position = carousel?.scrollLeft;
    const scrollAmount = 200;

    if (position === undefined) {
      return;
    }

    if (direction === 'left') {
      carousel?.scroll({
        top: 0,
        left: position - scrollAmount,
        behavior: 'smooth'
      });
    }

    if (direction === 'right') {
      carousel?.scroll({
        top: 0,
        left: position + scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  async navigateToArticle(id: string): Promise<void> {
      await this.router.navigate([`articles/${id}`]);
  }
}
