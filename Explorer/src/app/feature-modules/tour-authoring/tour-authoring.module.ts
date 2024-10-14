import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeypointsComponent } from './keypoints/keypoints.component';



@NgModule({
  declarations: [
    KeypointsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KeypointsComponent
  ]
})
export class TourAuthoringModule { }
