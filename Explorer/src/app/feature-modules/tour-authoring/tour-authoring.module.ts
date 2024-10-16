import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeypointsComponent } from './keypoints/keypoints.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { KeypointFormComponent } from './keypoint-form/keypoint-form.component';
import { AdministrationModule } from "../administration/administration.module";
import { ReactiveFormsModule } from '@angular/forms';
import { ObjectComponent } from './object/object.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    KeypointsComponent,
    KeypointFormComponent,
    ObjectComponent,
    ObjectFormComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
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
