import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { PositionSimulatorComponent } from './position-simulator/position-simulator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';


@NgModule({
  declarations: [
    PositionSimulatorComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    SharedModule,
    MatButtonModule,
    MaterialModule
    
   
  ],
  exports: [
    PositionSimulatorComponent
  ]
})
export class TourExecutionModule { }
