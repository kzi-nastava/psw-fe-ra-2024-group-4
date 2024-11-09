import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { PositionSimulatorComponent } from './position-simulator/position-simulator.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PositionSimulatorComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    SharedModule
  ],
  exports: [
    PositionSimulatorComponent
  ]
})
export class TourExecutionModule { }
