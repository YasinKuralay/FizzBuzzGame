import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FizzbuzzDataService } from './services/fizzbuzz-data.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { FizzbuzzListElement } from '../interfaces';
import { By } from '@angular/platform-browser';
import {
  ReactiveFormsModule,
  FormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let fizzbuzzDataServiceMock: jasmine.SpyObj<FizzbuzzDataService>;
  let mockFizzbuzzList$: Subject<FizzbuzzListElement[]>;

  beforeEach(async () => {
    mockFizzbuzzList$ = new BehaviorSubject<FizzbuzzListElement[]>([]);
    fizzbuzzDataServiceMock = jasmine.createSpyObj(
      'FizzbuzzDataService',
      [
        'startEmittingItemsOnInterval',
        'stopEmittingItemsOnInterval',
        'resetFizzbuzzList',
      ],
      { fizzbuzzList$: mockFizzbuzzList$ }
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: FizzbuzzDataService, useValue: fizzbuzzDataServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should initialize correctly', () => {
    // Trigger ngOnInit manually
    app.ngOnInit();

    expect(app.fizzbuzzList).toEqual([]);
    expect(app.stopperFormControl.value).toBe('');
    expect(app.stopperFormControl.hasValidator(Validators.required)).toBeTrue();
    expect(
      fizzbuzzDataServiceMock.startEmittingItemsOnInterval
    ).toHaveBeenCalled();
  });

  it('should start FizzBuzz sequence on button click', () => {
    // Trigger ngOnInit manually
    app.ngOnInit();

    const startButton = fixture.debugElement.query(
      By.css('.buttons-container button:first-child')
    );
    startButton.triggerEventHandler('click', null);
    expect(
      fizzbuzzDataServiceMock.startEmittingItemsOnInterval
    ).toHaveBeenCalledTimes(2); // Once on init, once on click
  });

  it('should stop FizzBuzz sequence on button click when input is valid', () => {
    app.stopperFormControl.setValue('stop');
    fixture.detectChanges();

    const stopButton = fixture.debugElement.query(
      By.css('.buttons-container button:nth-child(2)')
    );
    stopButton.triggerEventHandler('click', null);

    expect(
      fizzbuzzDataServiceMock.stopEmittingItemsOnInterval
    ).toHaveBeenCalled();
  });

  it('should disable stop button when input is invalid', () => {
    app.stopperFormControl.setValue('invalid');
    fixture.detectChanges();

    const stopButton = fixture.debugElement.query(
      By.css('.buttons-container button:nth-child(2)')
    );
    expect(stopButton.nativeElement.disabled).toBeTrue();
  });

  it('should reset FizzBuzz list on button click', () => {
    const resetButton = fixture.debugElement.query(
      By.css('.buttons-container button:last-child')
    );
    resetButton.triggerEventHandler('click', null);
    expect(fizzbuzzDataServiceMock.resetFizzbuzzList).toHaveBeenCalled();
  });

  it('should display FizzBuzz list items correctly', () => {
    const mockList: FizzbuzzListElement[] = [
      { uniqueId: '1', value: '1' },
      { uniqueId: '2', value: '2' },
      { uniqueId: '3', value: 'Fizz' },
    ];
    mockFizzbuzzList$.next(mockList);
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(
      By.css('.fizzbuzz-list-item')
    );
    expect(listItems.length).toBe(3);
    expect(listItems[0].nativeElement.textContent.trim()).toBe('1');
    expect(listItems[1].nativeElement.textContent.trim()).toBe('2');
    expect(listItems[2].nativeElement.textContent.trim()).toBe('Fizz');
  });

  it('should add "is-even" class to even list items', () => {
    const mockList: FizzbuzzListElement[] = [
      { uniqueId: '1', value: '1' },
      { uniqueId: '2', value: '2' },
    ];
    mockFizzbuzzList$.next(mockList);
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(
      By.css('.fizzbuzz-list-item')
    );
    expect(
      listItems[0].nativeElement.classList.contains('is-even')
    ).toBeFalse();
    expect(listItems[1].nativeElement.classList.contains('is-even')).toBeTrue();
  });

  it('should update fizzbuzzList when service emits new list', () => {
    const mockList: FizzbuzzListElement[] = [
      { uniqueId: '1', value: '1' },
      { uniqueId: '2', value: '2' },
    ];
    mockFizzbuzzList$.next(mockList);
    fixture.detectChanges();

    expect(app.fizzbuzzList).toEqual(mockList);
  });

  it('should unsubscribe and stop interval on component destruction', () => {
    fixture.destroy();
    expect(
      fizzbuzzDataServiceMock.stopEmittingItemsOnInterval
    ).toHaveBeenCalled();
  });
});
