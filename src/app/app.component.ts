import { Component, ViewEncapsulation } from '@angular/core';
import { FizzbuzzDataService } from './services/fizzbuzz-data.service';
import { FizzbuzzListElement } from '../interfaces';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  public fizzbuzzList: FizzbuzzListElement[] = [];
  private fizzbuzzListSubscription?: Subscription;
  public stopperFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^stop$/i),
  ]);

  constructor(private fizzbuzzDataService: FizzbuzzDataService) {}

  ngOnInit() {
    this.fizzbuzzListSubscription =
      this.fizzbuzzDataService.fizzbuzzList$.subscribe((list) => {
        this.fizzbuzzList = list;
      });
    this.fizzbuzzDataService.startEmittingItemsOnInterval();
  }

  ngOnDestroy() {
    this.fizzbuzzListSubscription?.unsubscribe();
    this.fizzbuzzDataService.stopEmittingItemsOnInterval();
  }

  /**
   * Starts the FizzBuzz sequence.
   */
  public startFizzBuzz() {
    this.fizzbuzzDataService.startEmittingItemsOnInterval();
  }

  /**
   * Stops the FizzBuzz sequence.
   *
   * @remarks Does NOT reset the list of FizzBuzz items.
   */
  public stopFizzBuzz() {
    this.fizzbuzzDataService.stopEmittingItemsOnInterval();
  }

  /**
   * Resets the list of FizzBuzz items.
   *
   * @remarks Does NOT stop the FizzBuzz sequence.
   */
  public resetFizzBuzzList() {
    this.fizzbuzzDataService.resetFizzbuzzList();
  }
}
