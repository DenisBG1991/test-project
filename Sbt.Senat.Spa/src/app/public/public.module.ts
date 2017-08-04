import {NgModule} from '@angular/core';
import {DashboardComponent} from '@app/presentation/dashboard/dashboard.component';
import {CalendarComponent} from '@app/presentation/forms/calendar/calendar.component';
import {DurationComponent} from '@app/presentation/forms/duration/duration.component';
import {AutosizeDirective} from '@app/presentation/ui-kit/text-input/multilingual-text-input/autosize.directive';

import {IssuesListComponent} from '@app/presentation/issue-list/issue-list.component';
import {LabelsComponent} from '@app/presentation/label/label.component';
import {TopMenuHeaderLayoutComponent} from '@app/presentation/layouts/top-menu-header-layout/top-menu-header-layout.component';
import {TopMenuLayoutComponent} from '@app/presentation/layouts/top-menu-layout/top-menu-layout.component';
import {PrimengLocaleProvider} from '@app/presentation/localization/primeng-locale-provider';
import {LoginComponent} from '@app/presentation/login/login.component';
import {MaterialBrowserComponent} from '@app/presentation/material-browser/material-browser.component';
import {AgendaItemAttendeeComponent} from '@app/presentation/meeting/agenda-item-attendee/agenda-item-attendee.component';
import {AgendaItemParticipantsComponent} from '@app/presentation/meeting/agenda-item-participants/agenda-item-participants.component';
import {ToPersonsPipe} from '@app/presentation/meeting/agenda-item-participants/to-persons.pipe';
import {AgendaComponent} from '@app/presentation/meeting/agenda/agenda.component';

import {
    MeetingParticipantAlternatedComponent
} from '@app/presentation/meeting/meeting-participant-alternated/meeting-participant-alternated.component';
import {MeetingParticipantRoleFilterPipe} from '@app/presentation/meeting/meeting-participants/meeting-participant-role-filter.pipe';
import {MeetingParticipantsComponent} from '@app/presentation/meeting/meeting-participants/meeting-participants.component';
import {MeetingsListComponent} from '@app/presentation/meetings-list/meetings-list.component';
import {PersonCardComponent} from '@app/presentation/persons/person-card/person-card.component';

import {SenatExpandableComponent} from '@app/presentation/senat-expandable/senat-expandable.component';
import {TopMenuComponent} from '@app/presentation/top-menu/top-menu.component';
import {AgendaService} from '@app/services/api/agenda.service';
import {IssueService} from '@app/services/api/issue.service';
import {LabelService} from '@app/services/api/label.service';
import {LoginService} from '@app/services/api/login.service';
import {MaterialService} from '@app/services/api/material.service';
import {MeetingService} from '@app/services/api/meeting.service';
import {VotingService} from '@app/services/api/voting.service';
import {ChannelService, SignalrWindow} from '@app/services/channel/channel.service';
import {AuthGuard} from '@app/services/guards/auth-guard';
import {UploadService} from '@app/services/uploads';
import {IssueMaterialsClient, IssuesClient, LabelsClient, MeetingsClient} from '@app/shared/api';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {StoreModule} from '@app/store/store.module';

import {CreateIssueComponent} from '@app/presentation/create-wizard/create-issue/create-issue.component';
import {CreateMeetingComponent} from '@app/presentation/create-wizard/create-meeting/create-meeting.component';
import {DecisionComponent} from '@app/presentation/decision/decision.component';
import {DownloadMobileAppComponent} from '@app/presentation/download-mobile-app/download-mobile-app.component';
import {DropZoneComponent} from '@app/presentation/drop-zone/drop-zone.component';
import {FileSelectComponent} from '@app/presentation/file-select/file-select.component';
import {IssueFormComponent} from '@app/presentation/ui-kit/forms/issue-form/issue-form.component';
import {MeetingAbsentiaFormComponent} from '@app/presentation/ui-kit/forms/meeting-absentia-form/meeting-absentia-form.component';
import {MeetingPresentiaFormComponent} from '@app/presentation/ui-kit/forms/meeting-presentia-form/meeting-presentia-form.component';
import {IssuePageContentComponent} from '@app/presentation/issue-page/issue-page-content/issue-page-content.component';
import {FilterMaterialUploadsPipe} from '@app/presentation/material-browser/filter-material-uploads.pipe';
import {FilterVersionUploadsPipe} from '@app/presentation/material-browser/filter-version-uploads.pipe';
import {IssuesFilterComponent} from '@app/presentation/issues-filter/issues-filter.component';
import {MaterialVersionComponent} from '@app/presentation/material-version/material-version.component';
import {AgendaItemProjectComponent} from '@app/presentation/meeting/agenda-item-project/agenda-item-project.component';
import {AgendaItemProjectsComponent} from '@app/presentation/meeting/agenda-item-projects/agenda-item-projects.component';
import {AgendaOrderPipe} from '@app/presentation/meeting/agenda/agenda-order.pipe';
import {MeetingsFilterComponent} from '@app/presentation/meetings-filter/meetings-filter.component';
import {PersonSelectShowComponent} from '@app/presentation/person-select-show/person-select-show.component';
import {PersonSelectComponent} from '@app/presentation/person-select/person-select.component';
import {SenatDropdownComponent} from '@app/presentation/senat-dropdown/senat-dropdown.component';
import {VoteComponent} from '@app/presentation/vote/vote.component';
import {VotesComponent} from '@app/presentation/votes/votes.component';
import {VotingBarComponent} from '@app/presentation/voting-bar/voting-bar.component';
import {VotingInfoComponent} from '@app/presentation/voting-info/voting-info.component';
import { routingPublic } from './public.routing';
import {PublicComponent} from './public.component';


import {SharedModule} from '@app/shared/shared.module';
import {DemoUiKitComponent} from '@app/presentation/demo-ui-kit/demo-ui-kit.component';
import {TopHeaderClosableComponent} from '@app/presentation/top-header-closable/top-header-closable.component';
import {CreateWizardComponent} from '@app/presentation/create-wizard/create-wizard.component';
import {DatePickerComponent} from '@app/presentation/ui-kit/date-picker/date-picker.component';
import {TimePickerComponent} from '@app/presentation/ui-kit/time-picker/time-picker.component';
import {DateTimePickerComponent} from '@app/presentation/ui-kit/date-time-picker/date-time-picker.component';
import {LabelAutocompleteComponent} from '@app/presentation/ui-kit/label-autocomplete/label-autocomplete.component';
import {PersonPicker1Component} from '@app/presentation/ui-kit/person-picker/person-picker-1/person-picker-1.component';
import {PersonNotSelectedComponent} from '@app/presentation/ui-kit/person-not-selected/person-not-selected.component';
import {CardComponent} from '@app/presentation/ui-kit/card/card.component';
import {FormComponent} from '@app/presentation/ui-kit/form/form.component';
import {DropdownComponent} from '@app/presentation/ui-kit/dropdown/dropdown.component';
import {PersonPickerSingleComponent} from '@app/presentation/ui-kit/person-picker/person-picker-single/person-picker-single.component';
import {BackNavigationService} from '@app/services/back-navigation.service';
import {CheckElementComponent} from '@app/presentation/ui-kit/check-element/check-element.component';
import {StatusLabelComponent} from '@app/presentation/ui-kit/status-label/status-label.component';
import {AgendaItemWorkflowButtonComponent} from '@app/presentation/ui-kit/agenda-item-workflow-button/agenda-item-workflow-button.component';
import {PopupFormComponent} from '@app/presentation/ui-kit/popup/popup-form/popup-form.component';
import {IssuePageHeaderComponent} from '@app/presentation/issue-page/issue-page-header/issue-page-header.component';
import {NavigateBackComponent} from '@app/presentation/ui-kit/navigate-back/navigate-back.component';
import {DropdownMenuComponent} from '@app/presentation/ui-kit/dropdown/dropdown-menu/dropdown-menu.component';
import {DropdownMenuItemComponent} from '@app/presentation/ui-kit/dropdown/dropdown-menu-item/dropdown-menu-item.component';
import {DropdownMenuSeparatorComponent} from '@app/presentation/ui-kit/dropdown/dropdown-menu-separator/dropdown-menu-separator.component';
import {CloseButtonMediumComponent} from '@app/presentation/ui-kit/button/close-button-medium/close-button-medium.component';
import {AgendaItemParticipantFilterPipe} from '@app/presentation/meeting/agenda-item-page-content/agenda-item-participant-filter.pipe';
import {AgendaItemPageContentComponent} from '@app/presentation/meeting/agenda-item-page-content/agenda-item-page-content.component';
import {AgendaItemPageHeaderComponent} from '@app/presentation/meeting/agenda-item-page-header/agenda-item-page-header.component';
import {AgendaItemComponent} from '@app/presentation/meeting/agenda-item/agenda-item.component';
import {
    PersonPickerMultipleComponent
} from '@app/presentation/ui-kit/person-picker/person-picker-multiple/person-picker-multiple.component';
import {AgendaItemSelectorComponent} from '@app/presentation/meeting/agenda-item-selector/agenda-item-selector.component';
import {GroupAlternatesPipe} from '@app/presentation/meeting/agenda-item-participants/group-alternates.pipe';
import {SelectorComponent} from '@app/presentation/ui-kit/selector/selector.component';
import {MeetingPageHeaderComponent} from '@app/presentation/meeting-page/meeting-page-header/meeting-page-header.component';
import {MeetingPageContentComponent} from '@app/presentation/meeting-page/meeting-page-content/meeting-page-content.component';
import { ConfirmComponent } from '@app/presentation/ui-kit/confirm/confirm.component';
import {ConfirmService} from '@app/presentation/ui-kit/confirm/confirm.service';

@NgModule({
    declarations: [
        AgendaComponent,
        AgendaItemComponent,
        AgendaItemPageHeaderComponent,
        AgendaItemPageContentComponent,
        AgendaItemParticipantFilterPipe,
        GroupAlternatesPipe,
        TopMenuLayoutComponent,
        TopMenuComponent,
        LoginComponent,
        DashboardComponent,
        MeetingsListComponent,
        MeetingPageHeaderComponent,
        MeetingPageContentComponent,
        MeetingParticipantRoleFilterPipe,
        MeetingParticipantsComponent,
        PersonCardComponent,
        TopMenuHeaderLayoutComponent,
        MeetingParticipantAlternatedComponent,
        AgendaItemParticipantsComponent,
        AgendaItemAttendeeComponent,
        IssuesListComponent,
        LabelsComponent,
        AgendaItemProjectsComponent,
        CreateIssueComponent,
        MeetingsFilterComponent,
        CreateMeetingComponent,
        IssuePageContentComponent,
        MaterialBrowserComponent,
        PersonSelectComponent,
        AutosizeDirective,
        DurationComponent,
        AgendaOrderPipe,
        ToPersonsPipe,
        PersonSelectShowComponent,
        CalendarComponent,
        IssueFormComponent,
        MeetingPresentiaFormComponent,
        MeetingAbsentiaFormComponent,
        MaterialVersionComponent,
        VotingBarComponent,
        VotingInfoComponent,
        VotesComponent,
        VoteComponent,
        DropZoneComponent,
        FileSelectComponent,
        FilterVersionUploadsPipe,
        FilterMaterialUploadsPipe,
        AgendaItemProjectComponent,
        DecisionComponent,
        DownloadMobileAppComponent,
        DecisionComponent,
        IssuesFilterComponent,
        SenatExpandableComponent,
        SenatDropdownComponent,
        PublicComponent,
        DemoUiKitComponent,
        TopHeaderClosableComponent,
        CreateWizardComponent,
        DatePickerComponent,
        TimePickerComponent,
        DateTimePickerComponent,
        LabelAutocompleteComponent,
        PersonPicker1Component,
        PersonNotSelectedComponent,
        CardComponent,
        FormComponent,
        DropdownComponent,
        PersonPickerSingleComponent,
        PersonPickerMultipleComponent,
        CheckElementComponent,
        StatusLabelComponent,
        AgendaItemWorkflowButtonComponent,
        PopupFormComponent,
        SelectorComponent,
        IssuePageHeaderComponent,
        NavigateBackComponent,
        DropdownMenuComponent,
        DropdownMenuItemComponent,
        DropdownMenuSeparatorComponent,
        CloseButtonMediumComponent,
        AgendaItemSelectorComponent,
        ConfirmComponent
    ],
    entryComponents: [
        ConfirmComponent
    ],
    imports: [
        routingPublic,
        SharedModule,
        StoreModule
    ],
    providers: [
        AuthGuard,
        AgendaService,
        ChannelService,
        LoginService,
        MeetingService,
        IssueService,
        IssuesClient,
        LabelsClient,
        IssueMaterialsClient,
        MeetingsClient,
        LabelService,
        MaterialService,
        PrimengLocaleProvider,
        UploadService,
        VotingService,
        PermissionSelectors,
        BackNavigationService,
        ConfirmService,
        {provide: SignalrWindow, useValue: window}
    ]
})
export class PublicModule {}
