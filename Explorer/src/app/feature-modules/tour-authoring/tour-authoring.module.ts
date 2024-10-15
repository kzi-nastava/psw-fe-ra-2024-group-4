import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeypointsComponent } from './keypoints/keypoints.component';
import { KeypointFormComponent } from './keypoint-form/keypoint-form.component';
import { AdministrationModule } from "../administration/administration.module";
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateTourComponent } from './create-tour/create-tour.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { TourDetailsComponent } from './tour-details/tour-details.component';

@NgModule({
  declarations: [
    KeypointsComponent,
    KeypointFormComponent,
    CreateTourComponent,
    TourDetailsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdministrationModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule
],
  exports: [
    KeypointsComponent,
    KeypointFormComponent,
    CreateTourComponent,
    TourDetailsComponent
  ]
})
export class TourAuthoringModule { }
