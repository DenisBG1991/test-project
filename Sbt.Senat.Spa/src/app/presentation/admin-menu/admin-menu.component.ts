import { Component, OnInit } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';

import { NgRedux } from '@angular-redux/store';

import { Observable } from 'rxjs/Observable';

import { IAppState } from '@app/store/store';
import { PermissionEnum } from '@app/store/permission';

import { HttpUrlWrappingDecorator } from '@app/services/api/http-url-wrapping-decorator';

import { OrgUnit, OrgChildUnit } from '@app/presentation/admin-menu/org-unit.model';

@Component({
    selector: 'senat-admin-menu',
    templateUrl: './admin-menu.component.html',
    styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
    private defaultRequestOptions: BaseRequestOptions;
    private OrgsUnit: Array<OrgUnit> = [];
    private OrgsChildUnit: Array<OrgChildUnit> = [];
    private Org: Array<OrgUnit> | OrgUnit = [
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
    ];
    private Orgs: Array<OrgUnit> | OrgUnit = {
        id: 'd104cbd7-9620-4342-88d9-7f8ab3435435',
        name: 'Тинькоф',
        type: 'Holding',
        hasChildren: true
    };
    private target: OrgChildUnit = <OrgChildUnit>{};

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
        if (Array.isArray(this.Org)) {
            this.OrgsUnit = this.OrgsUnit.concat(this.Org);
        } else {
            this.OrgsUnit.push(<OrgUnit>this.Org);
        }
        /*this.http.get('api/v2.0/OrgsUnit', this.defaultRequestOptions)
            .flatMap((data) => data.json())
            .subscribe((data: Array<OrgUnit>) => {
                if (Array.isArray(data)) {
                    this.OrgsUnit = this.OrgsUnit.concat(data);
                } else {
                    this.OrgsUnit.push(<OrgUnit>data);
                }
            });*/
    };

    showMore(event, OrgUnit) {
        event.preventDefault();
        this.target = <OrgChildUnit>{};
        console.log(this.target);
        console.log(!!this.target.idParent);
        if (event.target.classList.contains('open')) {
            console.log('Up');
            event.target.classList.remove('open');
            event.target.nextElementSibling.classList.remove('openList');
            event.target.previousElementSibling.classList.remove('rotate90deg');
            event.target.previousElementSibling.classList.add('unRotate90deg');
        } else {
            console.log('Down');
            if (this.OrgsChildUnit.length === 0) {
                console.log('Low');
                if (Array.isArray(this.Orgs)) {
                    this.target = {
                        idParent: OrgUnit.id,
                        orgsChildUnit: [...this.Orgs]
                    };
                    this.OrgsChildUnit.push(this.target);
                } else {
                    this.target = <OrgChildUnit>{
                        idParent: OrgUnit.id,
                        orgsChildUnit: [this.Orgs]
                    };
                    this.OrgsChildUnit.push(this.target);
                }
                console.log('Low', this.target.idParent);
                console.log(!!this.target.idParent);
            } else {
                console.log('ForEach');
                for (let i = 0; i < this.OrgsChildUnit.length; i++) {
                    if (this.OrgsChildUnit[i].idParent === OrgUnit.id) {
                        this.target = this.OrgsChildUnit[i];
                        console.log('ForEach', this.target.idParent);
                        console.log(!!this.target.idParent);
                        break;
                    }
                }
                if (!this.target.idParent) {
                    console.log('New');
                    if (Array.isArray(this.Orgs)) {
                        this.target = {
                            idParent: OrgUnit.id,
                            orgsChildUnit: [...this.Orgs]
                        };
                        this.OrgsChildUnit.push(this.target);
                    } else {
                        this.target = <OrgChildUnit>{
                            idParent: OrgUnit.id,
                            orgsChildUnit: [this.Orgs]
                        };
                        this.OrgsChildUnit.push(this.target);
                    }
                    console.log('New', this.target.idParent);
                    console.log(!!this.target.idParent);
                }
            }
            event.target.classList.add('open');
            event.target.nextElementSibling.classList.add('openList');
            event.target.previousElementSibling.classList.remove('unRotate90deg');
            event.target.previousElementSibling.classList.add('rotate90deg');
        }
        /*if (this.showAllList) {
            if (this.OrgsChildUnit.length === 0) {
                this.http.get(`api/v2.0/OrgUnits?parent={${OrgUnit.id}}`, this.defaultRequestOptions)
                    .flatMap((data) => data.json())
                    .subscribe((data: Array<OrgUnit> | OrgUnit) => {
                        if (Array.isArray(data)) {
                            this.target = {
                                idParent: OrgUnit.id,
                                orgsChildUnit: [...data]
                            };
                            this.OrgsChildUnit.push(this.target);
                        } else {
                            this.target = <OrgChildUnit>{
                                idParent: OrgUnit.id,
                                orgsChildUnit: [data]
                            };
                            this.OrgsChildUnit.push(this.target);
                        }
                    });
            } else {
                for (let i = 0; i < this.OrgsChildUnit.length; i++) {
                    if (this.OrgsChildUnit[i].idParent === OrgUnit.id) {
                        this.target = this.OrgsChildUnit[i];
                        break;
                    }
                }
                if (isUndefined(this.target)) {
                    this.http.get(`api/v2.0/OrgUnits?parent={${OrgUnit.id}}`, this.defaultRequestOptions)
                        .flatMap((data) => data.json())
                        .subscribe((data: Array<OrgUnit> | OrgUnit) => {
                            if (Array.isArray(data)) {
                                this.target = {
                                    idParent: OrgUnit.id,
                                    orgsChildUnit: [...data]
                                };
                                this.OrgsChildUnit.push(this.target);
                            } else {
                                this.target = {
                                    idParent: OrgUnit.id,
                                    orgsChildUnit: [data]
                                };
                                this.OrgsChildUnit.push(this.target);
                            }
                        });
                }
            }
        }*/
    };

    getData(url, options) {
        this.http.get(url, options)
            .flatMap(data => data.json())
            .subscribe((data: Array<OrgUnit>) => data);
    };
}
