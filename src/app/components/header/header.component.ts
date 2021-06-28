import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  search: string;

  @Input() showAdmin: boolean;
  @Input() accountText: string;
  @Output() accountClick: EventEmitter<any>;
  @Output() cartClick: EventEmitter<any>;
  @Output() adminClick: EventEmitter<any>;
  @Output() searchClick: EventEmitter<string>;

  constructor() {
    this.showAdmin = false;
    this.cartClick = new EventEmitter<any>();
    this.accountClick = new EventEmitter<any>();
    this.adminClick = new EventEmitter<any>();
    this.searchClick = new EventEmitter<string>();
    this.accountText = '';
    this.search = '';
  }

  ngOnInit(): void {
  }

  emitAccountPress(): void {
    this.accountClick.emit();
  }

  emitCartPress(): void {
    this.cartClick.emit();
  }

  emitAdminPress(): void {
    this.adminClick.emit();
  }

  emitSearchPress(): void {
    this.searchClick.emit(this.search);
  }
}
