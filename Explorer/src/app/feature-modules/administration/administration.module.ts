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
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
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
    NotificationsComponent
  ]
})
export class AdministrationModule { }
