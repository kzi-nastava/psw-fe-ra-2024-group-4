import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

// Import Custom Components
import { KeypointsComponent } from './keypoints/keypoints.component';
import { KeypointFormComponent } from './keypoint-form/keypoint-form.component';
import { CreateTourComponent } from './create-tour/create-tour.component';
import { NecessaryEquipmentComponent } from './necessary-equipment/necessary-equipment.component';
import { ManageTourEquipmentComponent } from './manage-tour-equipment/manage-tour-equipment.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';

// Import Other Modules
import { AdministrationModule } from '../administration/administration.module';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';

@NgModule({
  declarations: [
    // Declare all components
    KeypointsComponent,
    KeypointFormComponent,
    CreateTourComponent,
    NecessaryEquipmentComponent,
    ManageTourEquipmentComponent,
    TourDetailsComponent
  ],
  imports: [
    // Import necessary modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AdministrationModule,

    // Material-specific modules
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatOptionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule
  ],
  exports: [
    // Export components to be used in other modules
    KeypointsComponent,
    KeypointFormComponent,
    CreateTourComponent,
    NecessaryEquipmentComponent,
    ManageTourEquipmentComponent,
    TourDetailsComponent
  ]
})
export class TourAuthoringModule { }

