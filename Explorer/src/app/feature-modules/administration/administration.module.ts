import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppReviewTableComponent } from './app-review-table/app-review-table.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AppReviewTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    AppReviewTableComponent
  ]
})
export class AdministrationModule { }
