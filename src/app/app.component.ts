import { Component, ViewEncapsulation } from '@angular/core';
import { FizzbuzzDataService } from './services/fizzbuzz-data.service';
import { FizzbuzzListElement } from '../interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  public fizzbuzzList: FizzbuzzListElement[] = [];

  constructor(private fizzbuzzDataService: FizzbuzzDataService) {}

  ngOnInit() {
    this.fizzbuzzDataService.fizzbuzzList$.subscribe((list) => {
      this.fizzbuzzList = list;
    });
    this.fizzbuzzDataService.startEmittingItemsOnInterval();
  }
}
