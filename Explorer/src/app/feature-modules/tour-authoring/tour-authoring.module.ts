import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateTourComponent } from './create-tour/create-tour.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { NecessaryEquipmentComponent } from './necessary-equipment/necessary-equipment.component';
import { ManageTourEquipmentComponent } from './manage-tour-equipment/manage-tour-equipment.component';

@NgModule({
  declarations: [CreateTourComponent, NecessaryEquipmentComponent, ManageTourEquipmentComponent],

  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,

    MatOptionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule
    
    
  ],
  exports: [
    CreateTourComponent, NecessaryEquipmentComponent, ManageTourEquipmentComponent
  ]
})
export class TourAuthoringModule { }
