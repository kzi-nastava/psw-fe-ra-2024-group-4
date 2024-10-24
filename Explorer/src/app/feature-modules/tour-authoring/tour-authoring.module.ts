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
import { SharedModule } from 'src/app/shared/shared.module';
// Import Other Modules
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { AdministrationModule } from "../administration/administration.module";
import { ObjectComponent } from './object/object.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MapForTourComponent } from './map-for-tour/map-for-tour.component';import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';
import { TourPreferencesFormComponent } from './tour-preferences-form/tour-preferences-form.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TourPreferencesComponent,
    TourPreferencesFormComponent,
  
    // Declare all components
    KeypointsComponent,
    KeypointFormComponent,
    CreateTourComponent,
    NecessaryEquipmentComponent,
    ManageTourEquipmentComponent,
    TourDetailsComponent,
    ObjectComponent,
    ObjectFormComponent,
    MapForTourComponent
  ],
  imports: [
    // Import necessary modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AdministrationModule,
    SharedModule,
    RouterModule,

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
    TourDetailsComponent,
    ObjectComponent
  ]
})
export class TourAuthoringModule { }

