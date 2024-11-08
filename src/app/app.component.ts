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
  /** The list used to render the items in the html. */
  public fizzbuzzList: FizzbuzzListElement[] = [];

  /** The formControl used to keep track of whether the user entered stop (case insensitive) in the input field, in which case the stop button will be enabled. */
  public stopperFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^stop$/i),
  ]);

  private fizzbuzzListSubscription?: Subscription;

  constructor(private fizzbuzzDataService: FizzbuzzDataService) {}

  /**
   * Subscribes to the fizzbuzzList from the fizzbuzzDataService.
   * Starts emitting items on interval.
   */
  ngOnInit() {
    this.fizzbuzzListSubscription =
      this.fizzbuzzDataService.fizzbuzzList$.subscribe((list) => {
        this.fizzbuzzList = list;
      });
    this.fizzbuzzDataService.startEmittingItemsOnInterval();
  }

  /**
   * Unsubscribes from the fizzbuzzListSubscription and stops emitting items on interval.
   */
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
