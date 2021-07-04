import {Component, Input, OnInit} from '@angular/core';
import {IUser} from '../../core/Interfaces/IUser';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  search: string;

  @Input() showAdmin: boolean | undefined;
  @Input() user: IUser;
  @Input() accountText: string;
  @Input() justLogo: boolean;

  constructor(private router: Router) {
    this.showAdmin = false;
    this.search = '';
    this.user = {};
    this.accountText = '';
    this.justLogo = false;
  }

  ngOnInit(): void {
  }

  toggleCart(): void {
    console.log('openslide');
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
}
