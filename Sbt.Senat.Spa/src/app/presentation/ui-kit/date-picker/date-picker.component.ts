import {Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DropdownComponent} from '@app/presentation/ui-kit/dropdown/dropdown.component';

@Component({
    selector: 'senat-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DatePickerComponent),
        multi: true
    }]
})
export class DatePickerComponent extends DropdownComponent implements OnInit, ControlValueAccessor {

    private _daySelected: Moment;
    private _monthDisplayed: Moment;
    private _value: Date;
    private _weekStart = 0;

    /**
     * Отображаемые дни (выбранный месяц + дополнения первой и послдней недель).
     * @type {Array}
     */
    daysDisplayed: Array<Moment> = [];

    get daySelected(): Moment {
        return this._value ? moment(this._value) : null;
    }

    set daySelected(value: Moment) {
        if (this._daySelected === value) {
            return;
        }

        this._daySelected = value;
        this.value = value.toDate();

        this.hide();

        if (!this._monthDisplayed.isSame(value, 'month')) {
            this.displayMonth(value);
        }
    }

    @Input()
    disabled = false;

    @ViewChild('dropdown')
    dropdown: ElementRef;

    expanded = false;

    @Input()
    format: string = null;

    @ViewChild('input')
    input: ElementRef;

    /**
     * Месяцы, их сокращённые имена (Jan, Feb и т.д.).
     * Лучше не использовать 'ru'-локализацию самого moment, в ней месяцы сокращаются разнородно
     * (например, вместо 'Янв' будет 'Янв.', но 'Март' не будет сокращён).
     */
    monthNames: Array<string> = moment.monthsShort();

    /**
     * Выбранный месяц.
     * @returns {string}
     */
    get monthNameSelected(): string {
        return this._monthDisplayed.format('MMM');
    }

    set monthNameSelected(value: string) {
        this.displayMonth(moment(`${value} + ${this.yearSelected}`, 'MMM YYYY'));
    }

    get value(): Date {
        return this._value;
    }

    set value(value: Date) {
        if (this._value === value) {
            return;
        }

        this._value = value;
        this._onChange(this._value);
    }

    /**
     * Справочник дней недели. Список их сокращённых имён (Mon, Tue, Wed и т.д.).
     * Лучше не использовать 'ru'-локализацию самого moment, в ней дни недели сокращаются разнородно и по слогам
     * (например, вместо 'ПН' будет 'Пон.')
     */
    weekdayNames: Array<string> = moment.weekdaysShort();

    @Input()
    weekends: Array<number> = [0, 6];

    /**
     * Отображаемые недели, последовательность чисел от 0 до N,
     * просто для удобства использования ngFor.
     */
    weeksDisplayed: Array<number>;

    /**
     * Начало недели. Число от 0 до 6, где 0 - это воскресенье.
     * @returns {number}
     */
    @Input()
    get weekStart(): number {
        return this._weekStart;
    }

    set weekStart(value: number) {
        // вычислять список дней недели в get() - не эффективно,
        // т.к. этот список изменяется только при изменении weekStart,
        if (this._weekStart === value) {
            return;
        }

        this._weekStart = value;

        let weekDays = moment.weekdaysShort();

        for (let count = 0; count < this.weekStart; count++) {
            const shifted = weekDays.shift(); // достаёт первый элемент из массива, почти как pop со стэком
            weekDays = weekDays.concat(shifted); // добавляем вытащеный из начала массива элемент в конец массива
        }

        this.weekdayNames = weekDays;
    }

    /**
     * Список доступных для выбора лет (YYYY).
     */
    yearsAvailable: Array<number> = [];

    get yearSelected(): number {
        return this._monthDisplayed.year();
    }

    set yearSelected(value: number) {
        this.displayMonth(moment(`${this.monthNameSelected} + ${value}`, 'MMM YYYY'));
    }

    private _onChange: (value: Date) => void = () => {
    };
    private _onTouched: () => void = () => {
    };

    constructor() {
        super();
        if (!this.format) {
            this.format = 'L';
        }
        const firstYear: number = moment().year() - 5;
        for (let i = firstYear; i < firstYear + 10; i++) {
            this.yearsAvailable.push(i);
        }

        // дни недели нумеруются с нуля, 0 - это sunday
        // weekday() - индекс дня недели, где 0 - это sunday
        // isoWeekday() - ISO номер дня недели, 7 - это sunday
        // weekdaysShort() - ['вс', 'пн', ...]
        this.weekStart = 1;

        this.displayMonth(moment());
    }

    ngOnInit() {
    }

    /**
     * Выбор месяца для отображения.
     */
    displayMonth(month: Moment) {
        const monthFirstDay = moment(month).startOf('month');
        const monthLastDay = moment(month).endOf('month');

        const days: Array<Moment> = []; // здесь будут дни для отображения выбранного месяца,
        // включая добавки предыдущего и следующего месяца, дополняющие неполные недели

        // дополнение первой неделеи днями предыдущего месяца
        const monthFirstWeekday = monthFirstDay.weekday();
        if (monthFirstWeekday !== this.weekStart) {
            if (monthFirstWeekday < this.weekStart) {
                for (let i = moment.weekdays().length - this.weekStart; i > 0; i--) {
                    days.push(moment(monthFirstDay).subtract(i, 'day'));
                }
            } else {
                for (let i = monthFirstWeekday - this.weekStart; i > 0; i--) {
                    days.push(moment(monthFirstDay).subtract(i, 'day'));
                }
            }
        }

        // дни выбранного месяца
        for (let i = 0; i < monthFirstDay.daysInMonth(); i++) {
            // moment не immutable, add() и subtract() изменяют его, при этом возвращая новое значение
            days.push(moment(monthFirstDay).add(i, 'day'));
        }

        // дополнение недели днями следующего месяца
        const monthLastWeekday = monthLastDay.weekday();
        const weekEnd = (this.weekStart + 6) % 7;
        if (monthLastWeekday !== weekEnd) {
            if (monthLastWeekday < weekEnd) {
                for (let i = 1; i <= weekEnd - monthLastWeekday; i++) {
                    days.push(moment(monthLastDay).add(i, 'day'));
                }
            } else {
                for (let i = 1; i <= moment.weekdays().length - monthLastWeekday; i++) {
                    days.push(moment(monthLastDay).add(i, 'day'));
                }
            }
        }

        this._monthDisplayed = month;

        this.daysDisplayed = days;
        this.weeksDisplayed = [];
        for (let i = 0; i < days.length / 7; i++) {
            this.weeksDisplayed.push(i);
        }
    }

    prevMonth() {
        this.displayMonth(moment(this._monthDisplayed).subtract(1, 'month'));
    }

    nextMonth() {
        this.displayMonth(moment(this._monthDisplayed).add(1, 'month'));
    }

    /**
     * Количество условий слишком большое для inline-использования в [ngClass],
     * поэтому они вынесены в этот метод.
     * @param day
     * @returns {any}
     */
    getCellClasses(day: Moment) {
        const classes = [];

        // не менять местами, css позиционный
        if (!day.isSame(moment(`${this.monthNameSelected} ${this.yearSelected}`, 'MMM YYYY'), 'month')) {
            classes.push('off');
        }

        if (this.weekends.indexOf(day.weekday()) !== -1) {
            classes.push('weekend');
        }

        if (this.daySelected && day.isSame(this.daySelected, 'day')) {
            classes.push('active');
        }

        return classes.reduce((value, current) => {
            return value ? value + ' ' + current : current;
        }, '');
    }

    //noinspection JSUnusedGlobalSymbols
    @HostListener('document:click', ['$event'])
    onClick(event) {
        // подписан на click, сворачивает элемент при клике вне области текстового поля
        if (this.dropdown && !this.input.nativeElement.contains(event.target) && !this.dropdown.nativeElement.contains(event.target)) {
            this.hide();
        }
    }

    hide() {
        this.expanded = false;
    }

    writeValue(value: Date): void {
        this._value = value;
    }

    registerOnChange(fn: (value: Date) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onBlur() {
        this._onTouched();
    }
}
