import {Injectable} from '@angular/core';

@Injectable()
export class RouterHistoryActions {
    static readonly NavigationCompleted = 'NAVIGATION_COMPLETED';

    createNavigationCompleted(url: string) {
        return {
            type: RouterHistoryActions.NavigationCompleted,
            payload: {
                url: url
            }
        };
    }
}
