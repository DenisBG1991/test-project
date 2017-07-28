import { Component, OnInit } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';

import { NgRedux } from '@angular-redux/store';

import { Observable } from 'rxjs/Observable';

import { IAppState } from '@app/store/store';
import { PermissionEnum } from '@app/store/permission';

import { HttpUrlWrappingDecorator } from '@app/services/api/http-url-wrapping-decorator';

import OrgUnit from '@app/presentation/admin-menu/admin-menu.model';
import OrgChildUnit from '@app/presentation/admin-menu/admin-menu-list.model';

@Component({
    selector: 'senat-admin-menu',
    templateUrl: './admin-menu.component.html',
    styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
    private defaultRequestOptions: BaseRequestOptions;
    private OrgsUnit: Array<OrgUnit> = [];
    private ListOrgsChildUnit: Array<OrgChildUnit> = [];
    /*
    private Org: Array<OrgUnit> = [
        {
            id: 'd104cbd7-9620-4342-88d9-7f8ab3809a72',
            name: 'ЦА',
            type: 'Holding',
            hasChildren: true
        },
        {
            id: 'd104cbd7-9620-4342-88d9-7f8ab3809a73',
            name: 'УЕ',
            type: 'Holding',
            hasChildren: false
        },
        {
            id: 'd104cbd7-9620-4342-88d9-7f8ab3809a74',
            name: 'КП',
            type: 'Holding',
            hasChildren: false
        },
        {
            id: 'd104cbd7-9620-4342-88d9-7f8ab3809a75',
            name: 'ТТ',
            type: 'Holding',
            hasChildren: true
        }
    ];*/
    private target: OrgChildUnit;
    private showAllList = false;

    showCreatePerson$: Observable<boolean> = this._ngRedux.select(x => x.permissions.some(
        p => p.permission === PermissionEnum.CreatePerson));

    constructor(private _ngRedux: NgRedux<IAppState>,
                private http: HttpUrlWrappingDecorator) {
        this.defaultRequestOptions = new BaseRequestOptions();
        this.defaultRequestOptions.headers.set('content-type', 'application/json');
        this.defaultRequestOptions.headers.set('accept', 'application/json');
        this.defaultRequestOptions.withCredentials = true;
    };

    ngOnInit() {
        this.http.get('api/v2.0/OrgsUnit', this.defaultRequestOptions)
            .flatMap((data) => data.json())
            .subscribe((data: Array<OrgUnit>) => {
                if (Array.isArray(data)) {
                    this.OrgsUnit = this.OrgsUnit.concat(data);
                } else {
                    this.OrgsUnit.push(data);
                }
            });
    };

    showMore(event, OrgUnit) {
        event.preventDefault();
        if (this.ListOrgsChildUnit.length === 0) {
            this.http.get(`api/v2.0/OrgsUnit?parent={${OrgUnit.id}}`, this.defaultRequestOptions)
                .flatMap((data) => data.json())
                .subscribe((data: Array<OrgUnit>) => {
                    if (Array.isArray(data)) {
                        this.target = {
                            idParent: OrgUnit.id,
                            orgChildUnits: [...data]
                        };
                        this.ListOrgsChildUnit.push(this.target);
                    } else {
                        this.target = {
                            idParent: OrgUnit.id,
                            orgChildUnits: [data]
                        };
                        this.ListOrgsChildUnit.push(this.target);
                    }
                });
        } /*else {
            for (let i = 0; i < this.List.length; i++) {
                if (this.List[i].id ===  OrgUnit.id) {
                    target = this.List[i];
                } else {
                    this.http.get(`api/v2.0/OrgsUnit?parent={${OrgUnit.id}}`, this.defaultRequestOptions)
                        .flatMap((data) => data.json())
                        .subscribe((data: Array<OrgUnit>) => {
                            if (Array.isArray(data)) {
                                this.List = this.List.concat(data);
                            } else {
                                this.List.push(data);
                            }
                        });
                }
            }
        }*/
        this.showAllList = !this.showAllList;
        this.showAllList ? event.target.classList.add('openList') : event.target.classList.remove('openList');
    };

}
