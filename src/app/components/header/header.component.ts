import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IUser} from '../../core/Interfaces/IUser';
import {Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  search: string;

  @Input() showAdmin: boolean | undefined;
  @Input() user: IUser;
  @Input() accountText: string;
  @Input() justLogo: boolean;
  articleCount: number;
  subscription: Subscription;
  showSlide: boolean;

  constructor(private router: Router,
              private cart: CartService) {
    this.showAdmin = false;
    this.articleCount = 0;
    this.search = '';
    this.showSlide = false;
    this.user = {};
    this.subscription = new Subscription();
    this.accountText = '';
    this.justLogo = false;
  }

  ngOnInit(): void {
    this.subscription = this.cart.cart$.subscribe(res => {
      this.articleCount = res.length;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async goToAccount(): Promise<void> {
    if (Object.keys(this.user).length > 0) {
      await this.router.navigate(['/account']);
      return;
    }

    await this.router.navigate(['/login']);
  }

  async goToAdminPanel(): Promise<void> {
    await this.router.navigate(['/admin']);
  }

  async navigateSearch(): Promise<void> {
    await this.router.navigate([`articles?search=${this.search}`]);
  }

  async goHome(): Promise<void> {
    await this.router.navigate(['/']);
  }

  hideSlide($event: boolean): void {
    this.showSlide = $event;
    document.body.style.overflowY = 'auto';
  }

  toggleCart(): void {
    this.showSlide = true;
    document.body.style.overflowY = 'hidden';
  }
}
