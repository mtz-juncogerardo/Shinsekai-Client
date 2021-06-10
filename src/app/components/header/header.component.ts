import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() showAdmin: boolean;
  @Input() accountText: string;
  @Output() accountClick: EventEmitter<any>;
  @Output() cartClick: EventEmitter<any>;
  @Output() adminClick: EventEmitter<any>;

  constructor() {
    this.showAdmin = false;
    this.cartClick = new EventEmitter<any>();
    this.accountClick = new EventEmitter<any>();
    this.adminClick = new EventEmitter<any>();
    this.accountText = '';
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
}
