import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminEncounterComponent } from './admin-encounter/admin-encounter.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "src/app/shared/shared.module";



@NgModule({
  declarations: [
    AdminEncounterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
]
})
export class EncounterModule { }
