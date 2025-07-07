import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { FormsModule } from '@angular/forms';

import { PersonEquipmentComponent } from './person-equipment/person-equipment.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileBadgesModalComponent } from './profile-badges-modal/profile-badges-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    InfoComponent,
    PersonEquipmentComponent,
    ProfileBadgesModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports:[
    InfoComponent,
    PersonEquipmentComponent
  ]
})
export class PersonInfoModule { }
