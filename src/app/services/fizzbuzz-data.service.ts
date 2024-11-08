import { Injectable } from '@angular/core';
import { FizzbuzzListElement } from '../../interfaces';
import { BehaviorSubject, Subscription, interval } from 'rxjs';

/**
 * This Service is responsible for all the data related to the Fizzbuzz game.
 *
 * The game is simple:
 * @describe
 *
 */
@Injectable({
  providedIn: 'root',
})
export class FizzbuzzDataService {
  constructor() {}

  /** The list of all FizzbuzzListElements. This will be exposed from this service via an observable. */
  private internalFizzbuzzList: FizzbuzzListElement[] = [];
  public fizzbuzzList$ = new BehaviorSubject<FizzbuzzListElement[]>([]);

  /** Keeps track of the current number of the list. Starts from 1 and goes up to 100 */
  private currentNumberOfList: number = 1;

  private fizzbuzzTimerSubscription: Subscription | undefined;

  /**
   * Starts the timer that emits the FizzbuzzListElements on an interval of 500ms.
   */
  public startEmittingItemsOnInterval(): void {
    this.fizzbuzzTimerSubscription = interval(500).subscribe(() => {
      this.calculateAndEmitNextItem();
    });
  }

  /**
   * If the fizzbuzzTimer is running, stops it.
   */
  public stopEmittingItemsOnInterval(): void {
    this.fizzbuzzTimerSubscription?.unsubscribe();
  }

  /**
   * Resets the FizzbuzzList to an empty array, and reverts the currentNumberOfList to 1.
   *
   * @important This does NOT stop the timer from running.
   */
  public resetFizzbuzzList(): void {
    this.currentNumberOfList = 1;
    this.internalFizzbuzzList = [];
    this.fizzbuzzList$.next(this.internalFizzbuzzList);
  }

  /**
   * The core logic of the Fizzbuzz game:
   * Adds a value to the internalFizzbuzzList based on the currentNumberOfList. Then emits the updated list.
   *
   * @Logic
   * If divisible by 3, adds 'Fizz'.
   * If divisible by 5, adds 'Buzz'.
   * If divisible by both 3 and 5, adds 'FizzBuzz'.
   * Otherwise, adds the current number as a string.
   * The game stops when the currentNumberOfList reaches 100 (inclusive, 100 still prints something).
   *
   */
  private calculateAndEmitNextItem(): void {
    if (this.currentNumberOfList > 100) {
      this.stopEmittingItemsOnInterval();
      return;
    }

    if (
      this.currentNumberOfList % 3 === 0 &&
      this.currentNumberOfList % 5 === 0
    ) {
      this.internalFizzbuzzList.push({
        uniqueId: this.generateUniqueId(this.currentNumberOfList),
        value: 'FizzBuzz',
      });
    } else if (this.currentNumberOfList % 3 === 0) {
      this.internalFizzbuzzList.push({
        uniqueId: this.generateUniqueId(this.currentNumberOfList),
        value: 'Fizz',
      });
    } else if (this.currentNumberOfList % 5 === 0) {
      this.internalFizzbuzzList.push({
        uniqueId: this.generateUniqueId(this.currentNumberOfList),
        value: 'Buzz',
      });
    } else {
      this.internalFizzbuzzList.push({
        uniqueId: this.generateUniqueId(this.currentNumberOfList),
        value: this.currentNumberOfList.toString(),
      });
    }

    this.currentNumberOfList++;
    this.fizzbuzzList$.next(this.internalFizzbuzzList);
  }

  /**
   * A simple uniqueId generator. Combines Math.random and the currentNumberOfList to guarantee uniqueness.
   *
   * @remarks
   * Uses math.random() for speed reasons: Could be changed to generate uuid s instead.
   *
   * @param currentNumberOfList The current number that is being used for printing the list. Used in addition to Math.random() to guarantee uniqueness.
   * @returns the uniqueId as a string.
   */
  private generateUniqueId(currentNumberOfList: number): string {
    return (
      Math.random().toString(36).substring(2) + currentNumberOfList.toString() // The substring(2) cuts off the beginning which always is '0.'
    );
  }
}