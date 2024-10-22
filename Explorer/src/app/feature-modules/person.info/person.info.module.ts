import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { FormsModule } from '@angular/forms';
import { PersonEquipmentComponent } from './person-equipment/person-equipment.component';


@NgModule({
  declarations: [
    InfoComponent,
    PersonEquipmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    InfoComponent,
    PersonEquipmentComponent
  ]
})
export class PersonInfoModule { }
