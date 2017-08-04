import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {ILabel} from '@app/store/label';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {ConfirmComponent} from '@app/presentation/ui-kit/confirm/confirm.component';
import {ConfirmService} from '@app/presentation/ui-kit/confirm/confirm.service';

@Component({
    selector: 'senat-demo-ui-kit',
    templateUrl: './demo-ui-kit.component.html',
    styleUrls: ['./demo-ui-kit.component.css']
})
export class DemoUiKitComponent implements OnInit {


    check = false;

    testText: string;

    buttonType = ButtonType;

    inputTest: string;

    maxLabelId = 7;

    labels: ILabel[] = [
        {name: 'demo', id: '1'},
        {name: 'senat', id: '2'},
        {name: 'meeting', id: '3'},
        {name: 'SBT', id: '4'},
        {name: 'Sber', id: '5'},
        {name: 'DartVaider', id: '6'},
        {name: 'newDemoSenat', id: '7'}
    ]

    suggestionLabels: ILabel[] = this.labels;

    currentLabels: ILabel[] = this.labels;

    pushText: string;
    pushState = 'fade';


    //    Part from Ilya
    persons: Array<{ id, pictureUrl, firstName, lastName, middleName }> = [
        {
            id: '1',
            pictureUrl: null,
            lastName: 'Жмаев',
            firstName: 'Николай',
            middleName: 'Николаевич'
        },
        {
            id: '6',
            pictureUrl: null,
            lastName: 'Почтарёв',
            firstName: 'Павел',
            middleName: 'Игоревич'
        },
        {
            id: '2',
            pictureUrl: null,
            lastName: 'Попов',
            firstName: 'Илья',
            middleName: 'Николаевич'
        },
        {
            id: '3',
            pictureUrl: null,
            lastName: 'Станкевич',
            firstName: 'Анастасия',
            middleName: 'Максимовна'
        },
        {
            id: '4',
            pictureUrl: null,
            lastName: 'Сыромятников',
            firstName: 'Дмитрий',
            middleName: 'Сергеевич'
        },
        {
            id: '5',
            pictureUrl: null,
            lastName: 'Филиппов',
            firstName: 'Антон',
            middleName: 'Сергеевич'
        }
    ];

    allCollegialBodies: Array<ICollegialBody> = [{
        id: '1',
        name: 'Управляющий комитет',
        company: null,
        holding: null
    }, {
        id: '2',
        name: 'Комитет по контролю',
        company: null,
        holding: null
    }];

    displayCollegialBodies: Array<ICollegialBody> = [];
    date = new Date('05/09/2017');


    notify(pushText: string) {
        this.pushText = pushText;
        setTimeout(() => {
            this.pushState = 'show'
        }, 100);
        setTimeout(() => {
            this.pushState = 'fade'
        }, 2000);
    }

    simulateCreation(labelName: string) {
        this.maxLabelId++;
        const newLabel = {name: labelName, id: this.maxLabelId.toString()};
        this.labels = [...this.labels, newLabel];
        this.currentLabels = [...this.currentLabels, newLabel];
        this.notify(`Label [${labelName}] has been created`);
    }

    simulateRetrieve(pattern: string) {
        this.suggestionLabels = this.labels.filter(l => l.name.toLowerCase().indexOf(pattern.toLowerCase()) > -1);
    }

    simulateSelect(labels: ILabel[]) {
        this.currentLabels = labels;
        this.notify(`${labels.length} labels selected`);
    }

    // confirmComponent: ConfirmComponent;

    constructor(private confirmServie: ConfirmService) {
    }


    showConfirm() {
        this.confirmServie.confirm('First confirm', () => {
            console.warn('First - Yes');
        }, () => {
            console.warn('First - No');
        });
        // this.confirmComponent.show();
    }
    showConfirm2() {
        this.confirmServie.confirm('Second confirm', () => {
            console.warn('Second - Yes');
        });
    }
    ngOnInit() {

        this.displayCollegialBodies = this.allCollegialBodies;
        // решение для создния confirm стандартным ViewContainerRef
        // const factory = this.componentFactoryResolver.resolveComponentFactory(ConfirmComponent);
        // this.confirmComponent = this.confirm.createComponent(factory).instance;
        // this.confirmComponent = this.viewContainerRef.createComponent(factory).instance;
    }


    log(e) {
        console.log(e);
    }

    filterCollegialBodies(value) {
        if (value) {
            this.displayCollegialBodies =
                this.allCollegialBodies.filter(f => !!f.name && f.name.toLowerCase().startsWith(value.toLowerCase()));
        } else {
            this.displayCollegialBodies = this.allCollegialBodies;
        }

    }

}
