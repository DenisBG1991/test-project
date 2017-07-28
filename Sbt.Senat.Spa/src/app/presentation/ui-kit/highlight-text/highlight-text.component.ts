import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'senat-highlight-text',
    templateUrl: './highlight-text.component.html',
    styleUrls: ['./highlight-text.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighlightTextComponent implements OnInit {

    @Input()
    text: string;

    @Input()
    highlight: string;

    get matches(): boolean {
        return this.text && this.highlight && this.getMatchIndex() !== -1;
    }

    get before(): string {
        return this.text.substr(0, this.getMatchIndex());
    }

    get match(): string {
        return this.text.substr(this.getMatchIndex(), this.highlight.length);
    }

    get after(): string {
        return this.text.substr(this.getMatchIndex() + this.highlight.length);
    }

    private getMatchIndex(): number {
        return this.text.toLowerCase().indexOf(this.highlight.toLowerCase());
    }

    ngOnInit() {
    }
}
