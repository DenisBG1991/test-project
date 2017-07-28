export class PostponedExecutionService {
    timer: any = null;
    executionInProgress = false;

    executionRequired = false;
    actionRequired: () => Promise<any>;

    constructor(private _timeout: number = 500) {

    }

    schedule(action: () => Promise<any>) {
        if (!this.timer) {
            this.timer = setTimeout(
                () => {
                    if (!this.executionInProgress) {
                        this.executeAction(action);
                    } else {
                        // If a request is in progress mark that a new search is required
                        this.executionRequired = true;
                        this.actionRequired = action;
                    }
                },
                this._timeout);
        }
    }

    private executeAction(action: () => Promise<any>) {
        this.timer = undefined;

        // if we have a search function and a valid search term call the search
        this.executionInProgress = true;

        action()
            .then(() => {
                this.executionInProgress = false;

                if (this.executionRequired) {
                    this.executionRequired = false;
                    this.actionRequired();
                }
            });
    }
}
