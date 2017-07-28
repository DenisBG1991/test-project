import {Injectable, Inject} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import * as models from './models';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';

/*
 'заготовка' взята тут https://blog.sstorie.com/integrating-angular-2-and-signalr-part-2-of-2/
 */

export class SignalrWindow extends Window {
    $: any;
}

export enum ConnectionState {
    Connecting = 1,
    Connected = 2,
    Reconnecting = 3,
    Disconnected = 4
}
@Injectable()
export class ChannelService {
    starting$: Observable<any>;
    connectionState$: Observable<ConnectionState>;
    error$: Observable<string>;
    issueChange$: Observable<models.IssueEvent>;
    votingUpdated$: Observable<models.VotingUpdatedEvent>;
    votingCreated$: Observable<models.VotingCreatedEvent>;
    votingEnded$: Observable<models.VotingEndedEvent>;

    private connectionStateSubject = new Subject<ConnectionState>();
    private startingSubject = new Subject<any>();
    private errorSubject = new Subject<any>();


    private hubConnection: any;
    private hubProxy: any;

    private issueSubject = new Subject<models.IssueEvent>();
    private votingUpdateSubject = new Subject<models.VotingUpdatedEvent>();
    private votingCreateSubject = new Subject<models.VotingCreatedEvent>();
    private votingEndedSubject = new Subject<models.VotingEndedEvent>();

    private _tryingToReconnect = false;

    constructor(@Inject(SignalrWindow) private window: SignalrWindow,
                @Inject(AppConfigInjectionToken) protected config: IAppConfig) {
        if (this.window.$ === undefined || this.window.$.hubConnection === undefined) {
            throw new Error('The variable \'$\' or the .hubConnection() function are not defined...' +
                ' please check the SignalR scripts have been loaded properly');
        }

        this.connectionState$ = this.connectionStateSubject.asObservable();
        this.error$ = this.errorSubject.asObservable();
        this.starting$ = this.startingSubject.asObservable();

        this.issueChange$ = this.issueSubject.asObservable();
        this.votingCreated$ = this.votingCreateSubject.asObservable();
        this.votingUpdated$ = this.votingUpdateSubject.asObservable();
        this.votingEnded$ = this.votingEndedSubject.asObservable();

        this.hubConnection = this.window.$.hubConnection();
        this.hubConnection.url = config.api.baseUrl + '/signalr';
        this.hubProxy = this.hubConnection.createHubProxy('issueHub');


        this.hubConnection.stateChanged((state: any) => {
            let newState = ConnectionState.Connecting;

            switch (state.newState) {
                case this.window.$.signalR.connectionState.connecting:
                    newState = ConnectionState.Connecting;
                    break;
                case this.window.$.signalR.connectionState.connected:
                    newState = ConnectionState.Connected;
                    break;
                case this.window.$.signalR.connectionState.reconnecting:
                    newState = ConnectionState.Reconnecting;
                    break;
                case this.window.$.signalR.connectionState.disconnected:
                    newState = ConnectionState.Disconnected;
                    break;
            }

            this.connectionStateSubject.next(newState);
        });


        this.hubConnection.reconnecting(() => {
            this._tryingToReconnect = true;
        });

        this.hubConnection.reconnected(function () {
            this._tryingToReconnect = false;
        });

        this.hubConnection.disconnected(() => {
            if (this._tryingToReconnect) {
                setTimeout(() => {
                    this.start();
                }, 7000);
            }
        });

        this.hubConnection.error((error: any) => {

            this.errorSubject.next(error);
        });

        this.hubProxy.on('issueChanged', (event: models.IssueEvent) => {

            if (event !== undefined) {
                return this.issueSubject.next(event);
            }
        });
        this.hubProxy.on('votingUpdated', (event: models.VotingUpdatedEvent) => {

            if (event !== undefined) {
                return this.votingUpdateSubject.next(event);
            }
        });
        this.hubProxy.on('votingCreated', (event: models.VotingCreatedEvent) => {

            if (event !== undefined) {
                return this.votingCreateSubject.next(event);
            }
        });
        this.hubProxy.on('votingEnded', (event: models.VotingEndedEvent) => {

            if (event !== undefined) {
                return this.votingEndedSubject.next(event);
            }
        });
    }

    start(): void {
        this.hubConnection.start()
            .done(() => {
                this._tryingToReconnect = false;
                this.startingSubject.next();
            })
            .fail((error: any) => {
                this._tryingToReconnect = true;
                this.startingSubject.error(error);
            });
    }

    stop(): void {
        this._tryingToReconnect = false;
        this.hubConnection.stop();
    }

    /*
     это просто для примера вызова сервера
     connect(): Observable<string> {
     this.starting$.subscribe(() => {
     this.hubProxy.invoke('Connect')
     .done(() => {
     console.log(`Successfully subscribed`);
     })
     .fail((error: any) => {
     this.issuerSubject.error(error);
     });
     },
     (error: any) => {
     this.issuerSubject.error(error);
     });
     return this.issuerSubject.asObservable();
     }
     */
}
