import {Injectable} from '@angular/core';
import {ApiService} from '@app/services/api/api.service';
import {Observable} from 'rxjs/Observable';
import {Person} from '@app/services/api/mapping.types';
import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {CreateEmployeeDto, EditEmloyeeDto, EmployeesClient} from '@app/shared/api';
import {IMultilingualPerson} from '@app/store/admin/person/person.model';
import {CustomHttp} from '@app/services/api/http';

@Injectable()
export class PersonService extends ApiService {
    constructor(http: CustomHttp,
                private _client: EmployeesClient) {
        super(http);
    }

    /**
     * Поиск людей.
     */
    getPersons(query: string): Observable<Array<IPerson>> {
        return this.http.get(`api/web/employees?query=${query}`, this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                return dto.items.map(x => Person.parse(x));
            });
    }

    getPerson(person: IPersonRef): Observable<IMultilingualPerson> {
        return this._client.getMultilingualEmployee(person.id)
            .map(dto => {
                const newPerson: IMultilingualPerson = {
                    id: dto.id,
                    lastName: dto.info.lastName,
                    firstName: dto.info.firstName,
                    middleName: dto.info.middleName,
                    pictureUrl: dto.info.profileUrl
                };
                return newPerson;
            });
    }

    createPerson(person: IMultilingualPerson): Observable<IMultilingualPerson> {
        return this._client.createEmployee(new CreateEmployeeDto({
            info: {
                firstName: person.firstName,
                lastName: person.lastName,
                middleName: person.middleName,
                profileUrl: person.pictureUrl
            }
        })).map(dto => {
            const newPerson: IMultilingualPerson = {
                id: dto.id,
                lastName: dto.info.lastName,
                firstName: dto.info.firstName,
                middleName: dto.info.middleName,
                pictureUrl: dto.info.profileUrl
            };
            return newPerson;
        });
    }

    updatePerson(person: IMultilingualPerson): Observable<IMultilingualPerson> {
        return this._client.editEmployee(new EditEmloyeeDto({
            id: person.id,
            info: {
                firstName: person.firstName,
                lastName: person.lastName,
                middleName: person.middleName,
                profileUrl: person.pictureUrl
            }
        })).map(dto => {
            const retPerson: IMultilingualPerson = {
                id: dto.id,
                lastName: dto.info.lastName,
                firstName: dto.info.firstName,
                middleName: dto.info.middleName,
                pictureUrl: dto.info.profileUrl
            };
            return retPerson;
        });
    }
}
