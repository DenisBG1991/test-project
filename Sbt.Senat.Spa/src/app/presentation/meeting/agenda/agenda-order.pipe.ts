import {Pipe, PipeTransform} from '@angular/core';
import {IAgendaItem} from '@app/store/agenda-item/agenda-item.model';

@Pipe({
    name: 'agendaOrder'
})
export class AgendaOrderPipe implements PipeTransform {

    transform(value: Array<IAgendaItem>): Array<IAgendaItem> {
        return value.sort((one, two) => {
            if (one.order > two.order) {
                return 1;
            }
            if (one.order === two.order) {
                return 0;
            }
            return -1;
        });
    }

}
