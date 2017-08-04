import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {IIssueListFilter, IssueListActions} from '@app/store/issue-list';
import {IPageInfo} from '@app/store/paging.model';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {AlignEnum} from '@app/presentation/senat-dropdown/senat-dropdown.component';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'senat-issues-filter',
    templateUrl: './issues-filter.component.html',
    styleUrls: ['./issues-filter.component.css']
})
export class IssuesFilterComponent implements OnDestroy, OnInit {

    private alignEnum = AlignEnum;

    nextPage: IPageInfo;

    private _subscriptions: Subscription[] = [];
    private _changeFilterEvents = new EventEmitter();
    filter: IIssueListFilter;

    collegialBodies$: Observable<Array<ICollegialBody>> = this._ngRedux
        .select(this._permissionSelectors.collegialBodyChildPermissionsFilter([
            PermissionEnum.ViewIssueInAgenda]));

    private _selectedCollegialBodyId: string;

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _actions: IssueListActions,
                private _collegialBodyActions: CollegialBodyActions,
                private _permissionSelectors: PermissionSelectors) {
    }

    ngOnInit() {
        this._subscriptions = [
            this._ngRedux.select(x => {
                return {
                    pageNum: x.issueList.paging.currentPage + 1,
                    pageSize: x.issueList.paging.pageSize
                };
            }).subscribe(x => {
                this.nextPage = x;
            }),
            this._ngRedux.select(x => x.issueList.filter)
                .subscribe(x => {
                    this.filter = x;
                })
        ];

        this._changeFilterEvents
            .debounce(() => Observable.interval(300))
            .subscribe(s => {
                this.reload();
            });

        this._ngRedux.dispatch(this._collegialBodyActions.updateCollegialBodies());
        this._ngRedux.dispatch(this._actions.loadIssuesPage(this.filter, {
            pageNum: 1,
            pageSize: 20
        }));
    }

    clearFilters() {
        this.filter = {};
        this.reload();
        this._selectedCollegialBodyId = null;
    }

    onFilterChange($event): void {
        this._changeFilterEvents.emit($event);
    }

    ngOnDestroy(): void {
        for (let sub of this._subscriptions) {
            sub.unsubscribe();
        }
    }

    loadPage(filter: IIssueListFilter, page: IPageInfo) {
        this._ngRedux.dispatch(this._actions.loadIssuesPage(filter, page));
    }


    selectCollegialBody(body: ICollegialBody) {
        this.filter.collegialBody = body;
        this.onFilterChange(body);
        if (body) {
            this._selectedCollegialBodyId = body.id;
        } else {
            this._selectedCollegialBodyId = null;
        }
    }

    reload() {
        this._ngRedux.dispatch(this._actions.loadIssuesPage(this.filter, {
            pageNum: 1,
            pageSize: 20
        }));
    }


}
