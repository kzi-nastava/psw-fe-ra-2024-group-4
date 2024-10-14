import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    InfoComponent
  ]
})
export class PersonInfoModule { }
