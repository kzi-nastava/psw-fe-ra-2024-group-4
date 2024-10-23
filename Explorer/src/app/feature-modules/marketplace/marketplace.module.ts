import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToursForAuthorComponent } from './tours-for-author/tours-for-author.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourAuthoringModule } from '../tour-authoring/tour-authoring.module';
import { KeypointDialogComponent } from './keypoint-dialog/keypoint-dialog.component';



@NgModule({
  declarations: [ToursForAuthorComponent, KeypointDialogComponent], 
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TourAuthoringModule
  ],
  exports: [
    ToursForAuthorComponent
  ]
})
export class MarketplaceModule { }
