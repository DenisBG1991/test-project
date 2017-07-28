import {Injectable} from '@angular/core';

@Injectable()
export class ControlsLayoutActions {
    static readonly ToggleItems = '[LAYOUT]-CONTROLS-TOGGLE-ITEMS';

    toggleItems() {
        return {
            type: ControlsLayoutActions.ToggleItems
        };
    }
}
