import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IAgendaItem, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {IAppState} from '@app/store/store';
import {NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';
import {IIssue, IIssueRef, IssueActions} from '@app/store/issue';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {PermissionEnum} from '@app/store/permission';
import {AgendaItemWorkflowAction} from '@app/store/agenda-item/agenda-item-workflow-action';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';

@Component({
    selector: 'senat-agenda',
    templateUrl: './agenda.component.html',
    styleUrls: ['./agenda.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaComponent implements OnInit {

    buttonType = ButtonType;

    items: Array<IAgendaItem>;

    @Input()
    meeting: IMeetingRef;

    srcItem: IAgendaItem;
    trgItem: IAgendaItem;

    query = '';

    get canEdit$(): Observable<boolean> {
        return this.hasPermission$(PermissionEnum.EditMeeting);
    }

    get suggestions$(): Observable<Array<IIssue>> {
        return this._ngRedux.select(x => x.issues
            .filter(i => (i.title as any).toLowerCase().indexOf(this.query.toLowerCase()) !== -1 &&
            i.status !== 'Preparing')
            .filter(i => !this.items.some(ai => ai.issue.id === i.id))
            .sort((one, two) => {
                if (one.createDate > two.createDate) {
                    return 1;
                }
                if (one.createDate < two.createDate) {
                    return -1;
                }
                return 0;
            }));
    }

    items$: Observable<Array<IAgendaItem>> =
        this._ngRedux.select(x => x.agendaItems.filter(i => i.meeting.id === this.meeting.id));

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _agendaItemActions: AgendaItemActions,
                private _issueActions: IssueActions,
                private _permissionSelectors: PermissionSelectors) {

    }

    ngOnInit() {
        this._ngRedux.select(x => x.agendaItems.filter(i => i.meeting.id === this.meeting.id))
            .subscribe(items => {
                this.items = items;
            });
    }

    onDragOver(e: DragEvent, item: IAgendaItem) {
        e.preventDefault(); // по умолчанию дроп запрещён. Для его разрешения нужно выполнить preventDefault()
    }

    onDragStart(e: DragEvent, item: IAgendaItem) {
        this.srcItem = item;
        this.trgItem = item;

        console.log(`${this.srcItem.order} -> ${this.trgItem.order}`);
    }

    /**
     * Втаскивание элемента в drop-зону. Используем для актуализации trgItem (для выделения элемента в интерфейсе).
     * @param e
     * @param item
     */
    onDragEnter(e: DragEvent, item: IAgendaItem) {
        this.trgItem = item;

        console.log(`${this.srcItem.order} -> ${this.trgItem.order}`);
    }

    /**
     * Сброс элемента в drop-зону.
     * @param e
     * @param trgItem
     */
    onDrop(e: DragEvent, trgItem: IAgendaItem) {

        if (this.trgItem.order === this.srcItem.order) {
            return;
        }

        const srcItem = this.srcItem;
        const targetOrder = this.trgItem.order;

        console.log(`${this.srcItem.order} -> ${trgItem.order}`);

        // order'ы изменяются только в пределах диапазона перемещения
        // вычисляем диапазон
        // сортируем элементы в нужном порядке (в прямом при перемещении вниз и в обратном при перемещении вверх)
        // swap'аем соседние элементы уполрядоченного диапазона, имитируя перемещение элемента вверх/вниз по списку
        const moveUp = this.trgItem.order < this.srcItem.order;

        const dragRangeStart = Math.min(this.trgItem.order, this.srcItem.order);
        const dragRangeEnd = Math.max(this.trgItem.order, this.srcItem.order);

        const itemsInRange = this.items.filter(x => x.order >= dragRangeStart && x.order <= dragRangeEnd)
            .sort((one, two) => {
                if (one.order > two.order) {
                    return moveUp ? -1 : 1;
                }
                if (one.order < two.order) {
                    return moveUp ? 1 : -1;
                }
                return 0;
            });

        for (let index = 0; index < itemsInRange.length - 1; index++) {
            const orderBuf = itemsInRange[index].order;
            itemsInRange[index].order = itemsInRange[index + 1].order;
            itemsInRange[index + 1].order = orderBuf;

            const buf = itemsInRange[index];
            itemsInRange[index] = itemsInRange[index + 1];
            itemsInRange[index + 1] = buf;
        }

        // OnPush -> нужно изменить ссылку на массив
        this.items = this.items.filter(x => x.order < dragRangeStart || x.order > dragRangeEnd)
            .concat(itemsInRange);

        this._ngRedux.dispatch(this._agendaItemActions.moveAgendaItem(srcItem, targetOrder));
    }

    /**
     * Завершение перетаскивания. Вызывается в любом случае в конце drag&drop цикла для перетаскиваемого элемента.
     * @param e
     * @param item
     */
    onDragEnd(e: DragEvent, item: IAgendaItem) {
        this.srcItem = null;
        this.trgItem = null;
    }

    remove(item: IAgendaItem) {
        if (confirm('Удалить вопрос из повестки?')) {
            this._ngRedux.dispatch(this._agendaItemActions.removeAgendaItem(item));
        }
    }

    findIssues(query: string) {
        const collegialBody = this._ngRedux.getState()
            .meetings.items.find(m => m.id === this.meeting.id).collegialBody;

        this._ngRedux.dispatch(this._issueActions.findIssues(collegialBody, query));
    }

    private isSelected(issue: IIssueRef) {
        return this._ngRedux.getState().agendaItems.filter(x => x.meeting.id === this.meeting.id)
                .find(i => i.issue.id === issue.id) != null;
    }

    selectIssues(issues: Array<IIssueRef>) {
        const agendaItems = issues.filter(issue => !this.isSelected(issue))
            .map(issue => {
                return {
                    meeting: this.meeting,
                    issue: issue
                };
            });
        this._ngRedux.dispatch(this._agendaItemActions.createAgendaItems(agendaItems, this.meeting));
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.meetingHasPermision(permission, this.meeting));
    }

    move(item: IAgendaItemRef, action: AgendaItemWorkflowAction) {
        this._ngRedux.dispatch(this._agendaItemActions.moveAgendaItemState(item, action));
    }
}
