import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeypointsComponent } from './keypoints/keypoints.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { KeypointFormComponent } from './keypoint-form/keypoint-form.component';
import { AdministrationModule } from "../administration/administration.module";
import { ReactiveFormsModule } from '@angular/forms';
import { ObjectComponent } from './object/object.component';

@NgModule({
  declarations: [
    KeypointsComponent,
    KeypointFormComponent,
    ObjectComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdministrationModule,
    ReactiveFormsModule
],
  exports: [
    KeypointsComponent,
    KeypointFormComponent,
    ObjectComponent
  ]
})
export class TourAuthoringModule { }
