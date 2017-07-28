import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ChannelService} from '@app/services/channel/channel.service';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {VotingActions} from '@app/store/voting/voting.actions';
import {VoteActions} from '@app/store/vote/vote.actions';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {NavigationEnd, Router} from '@angular/router';
import {RouterHistoryActions} from '@app/store/router/router-history.actions';

@Component({
  selector: 'senat-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit, OnDestroy {
    private _subscriptions: Subscription[];

    constructor(private channelService: ChannelService,
                private _ngRedux: NgRedux<IAppState>,
                private _votingActions: VotingActions,
                private _voteActions: VoteActions,
                private  _permissionActions: PermissionActions,
                private _router: Router,
                private _routerHistoryActions: RouterHistoryActions) {


        this._subscriptions = [
            this._ngRedux.select(s => s.currentUser)
                .subscribe(u => {
                    if (u) {
                        this._ngRedux.dispatch(this._permissionActions.loadGroupPermissions());
                        console.log('Starting the channel service');
                        this.channelService.start();
                    } else {
                        // todo: очистка permission
                        console.log('Stoping the channel service');
                        this.channelService.stop();
                    }
                }),

            this.channelService.votingCreated$.subscribe(e => {
                this._ngRedux.dispatch(this._votingActions.loadVotingsComplete([{
                    id: e.Id,
                    meeting: {
                        id: e.Meeting.Id
                    },
                    subject: {
                        id: e.DecisionProject.Id,
                        num: e.DecisionProject.Version
                    },
                    votesFor: 0,
                    votesAbstain: 0,
                    votesAgainst: 0,
                    vetoApplied: false,
                    closed: false
                }]));
            }),

            this.channelService.votingUpdated$.subscribe(e => {
                this._ngRedux.dispatch(this._votingActions.loadVotingsComplete([{
                    id: e.Id,
                    meeting: {
                        id: e.Meeting.Id
                    },
                    subject: {
                        id: e.DecisionProject.Id,
                        num: e.DecisionProject.Version
                    },
                    votesFor: e.For,
                    votesAbstain: e.Abstain,
                    votesAgainst: e.Against,
                    vetoApplied: (e.Veto !== 0),
                    closed: false
                }]));
                this._ngRedux.dispatch(this._voteActions.loadVotes({
                    id: e.Id
                }));
            }),
            this.channelService.votingEnded$.subscribe(e => {
                this._ngRedux.dispatch(this._votingActions.loadVotingsComplete([{
                    id: e.Id,
                    meeting: {
                        id: e.Meeting.Id
                    },
                    subject: {
                        id: e.DecisionProject.Id,
                        num: e.DecisionProject.Version
                    },
                    votesFor: e.For,
                    votesAbstain: e.Abstain,
                    votesAgainst: e.Against,
                    vetoApplied: (e.Veto !== 0),
                    closed: true
                }]));
            })

            /*             this.channelService.issueChange$.subscribe(e => {
             this._ngRedux.dispatch(this._channelActions.issueChanged(e));
             })*/
        ];

        this.channelService.error$.subscribe(
            (error: any) => {
                console.warn(error);
            },
            (error: any) => {
                console.error('errors$ error', error);
            }
        );

        this.channelService.starting$.subscribe(
            () => {
                console.log('signalr service has been started');
            },
            () => {
                console.warn('signalr service failed to start!');
            }
        );

        // Needs for RouterHistory
        this._router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(event => {
                const eventNavEnd = <NavigationEnd> event;
                this._ngRedux.dispatch(this._routerHistoryActions.createNavigationCompleted(eventNavEnd.urlAfterRedirects));
            });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this._subscriptions.forEach(s => s.unsubscribe());
    }
}
