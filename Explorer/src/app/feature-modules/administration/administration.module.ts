import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubInvitationComponent } from './club-invitation/club-invitation.component';
import { ClubDetailsComponent } from './club-details/club-details.component';
import { ClubComponent } from './club/club.component';
import { ClubFormComponent } from './club-form/club-form.component';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AppReviewTableComponent } from './app-review-table/app-review-table.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ClubInvitationComponent,
    ClubDetailsComponent,
    ClubComponent,
    ClubFormComponent,
    AccountComponent,
    AppReviewTableComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ClubInvitationComponent,
    ClubDetailsComponent,
    ClubComponent,
    ClubFormComponent,
    AccountComponent,
    AppReviewTableComponent

  ]
})
export class AdministrationModule { }
