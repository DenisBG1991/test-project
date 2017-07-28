import {Pipe, PipeTransform} from '@angular/core';
import {IPerson} from '@app/store/person/person.model';

@Pipe({
    name: 'toPersons'
})
export class ToPersonsPipe implements PipeTransform {

    transform(value: Array<{ person: IPerson }>): Array<IPerson> {
        return value.map(x => x.person);
    }

}
