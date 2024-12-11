import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubJoinRequestComponent } from './club-join-request/club-join-request.component';
import { ClubInvitationComponent } from './club-invitation/club-invitation.component';
import { ClubDetailsComponent } from './club-details/club-details.component';
import { ClubComponent } from './club/club.component';
import { ClubFormComponent } from './club-form/club-form.component';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AppReviewTableComponent } from './app-review-table/app-review-table.component';
import { PublicStatusRequestComponent } from './public-status-request/public-status-request.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { QuizComponent } from './quiz/quiz.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClubMembersComponent } from './club-members/club-members.component';
import { EncounterPublicStatusRequestComponent } from './encounter-public-status-request/encounter-public-status-request/encounter-public-status-request.component';

import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ClubTourComponent } from './club-tour/club-tour.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ClubJoinRequestComponent,
    ClubInvitationComponent,
    ClubDetailsComponent,
    ClubComponent,
    ClubFormComponent,
    AccountComponent,
    AppReviewTableComponent,
    PublicStatusRequestComponent,
    NotificationsComponent,
    QuizComponent,
    ClubMembersComponent,
    EncounterPublicStatusRequestComponent,
    ClubTourComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    MatCheckboxModule,       
    MatListModule,   
    MatFormFieldModule,      
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    DragDropModule,
    CdkDrag
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ClubInvitationComponent,
    ClubDetailsComponent,
    ClubComponent,
    ClubFormComponent,
    AccountComponent,
    AppReviewTableComponent,
    PublicStatusRequestComponent,
    NotificationsComponent,
  ]
})
export class AdministrationModule { }
