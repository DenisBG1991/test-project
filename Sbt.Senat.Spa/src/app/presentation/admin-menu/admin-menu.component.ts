import { Component, OnInit } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';

import { NgRedux } from '@angular-redux/store';

import { Observable } from 'rxjs/Observable';

import { IAppState } from '@app/store/store';
import { PermissionEnum } from '@app/store/permission';

import { OrgUnit, FullOrgsUnit } from '@app/presentation/admin-menu/orgs-unit.model';
import { LoadDataService } from '@app/presentation/admin-menu/admin-menu.service';

@Component({
    selector: 'senat-admin-menu',
    templateUrl: './admin-menu.component.html',
    styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
    private defaultRequestOptions: BaseRequestOptions;
    private OrgsUnit: Array<FullOrgsUnit> = [];
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
    private Orgs: Array<OrgUnit> | OrgUnit = [
        {
            id: 'd104cbd7-9620-4342-88d9-7f8a234234234',
            name: 'Сбербанк',
            type: 'Holding',
            hasChildren: true
        },
        {
            id: 'd104cbd7-9620-4342-88d9-7f456456456546',
            name: 'Альфабанк',
            type: 'Holding',
            hasChildren: true
        },
        {
            id: 'd104cbd7-9620-4342-88d9-7f8a99997767',
            name: 'Тинькоф',
            type: 'Holding',
            hasChildren: true
        }
    ];
    private target: FullOrgsUnit;

    showCreatePerson$: Observable<boolean> = this._ngRedux.select(x => x.permissions.some(
        p => p.permission === PermissionEnum.CreatePerson));

    constructor(private _ngRedux: NgRedux<IAppState>,
                private loadDataService: LoadDataService) {
        this.defaultRequestOptions = new BaseRequestOptions();
        this.defaultRequestOptions.headers.set('content-type', 'application/json');
        this.defaultRequestOptions.headers.set('accept', 'application/json');
        this.defaultRequestOptions.withCredentials = true;
    };

    ngOnInit() {
        /*
        if (Array.isArray(this.Org)) {
            for (let j = 0; j < this.Org.length; j++) {
                if (Array.isArray(this.Orgs)) {
                    this.target = {...this.Org[j], orgChildUnit: this.Orgs};
                    this.OrgsUnit.push(this.target);
                } else {
                    this.target = {...this.Org[j], orgChildUnit: [this.Orgs]};
                    this.OrgsUnit.push(this.target);
                }
            }
        } else {
            if (Array.isArray(this.Orgs)) {
                this.target = {...this.Org, orgChildUnit: this.Orgs};
                this.OrgsUnit.push(this.target);
            } else {
                this.target = {...this.Org, orgChildUnit: [this.Orgs]};
                this.OrgsUnit.push(this.target);
            }
        }*/

        this.loadDataService.loadData('api/v2.0/OrgUnits', this.defaultRequestOptions)
            .subscribe(data => {
                if (Array.isArray(data)) {
                    for (let j = 0; j < data.length; j++) {
                        this.loadDataService.loadData(`api/v2.0/OrgUnits?parent={${data[j]['id']}}`, this.defaultRequestOptions)
                            .subscribe(child => {
                                if (Array.isArray(child)) {
                                    this.target = {...data[j], orgChildUnit: child};
                                    this.OrgsUnit.push(this.target);
                                } else {
                                    this.target = {...data[j], orgChildUnit: [child]};
                                    this.OrgsUnit.push(this.target);
                                }
                            });
                    }
                } else {
                    this.loadDataService.loadData(`api/v2.0/OrgUnits?parent={${data['id']}}`, this.defaultRequestOptions)
                        .subscribe(child => {
                            if (Array.isArray(child)) {
                                this.target = {...data, orgChildUnit: child};
                                this.OrgsUnit.push(this.target);
                            } else {
                                this.target = {...data, orgChildUnit: [child]};
                                this.OrgsUnit.push(this.target);
                            }
                        });
                }
            });
    };

    showMore(event) {
        event.preventDefault();
        if (event.target.classList.contains('open')) {
            event.target.classList.remove('open');
            event.target.nextElementSibling.classList.remove('openList');
            event.target.previousElementSibling.classList.remove('rotate90deg');
            event.target.previousElementSibling.classList.add('unRotate90deg');
        } else {
            event.target.classList.add('open');
            event.target.nextElementSibling.classList.add('openList');
            event.target.previousElementSibling.classList.remove('unRotate90deg');
            event.target.previousElementSibling.classList.add('rotate90deg');
        }
    };
}
