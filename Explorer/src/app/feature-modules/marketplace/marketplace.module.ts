import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemComponent } from './problem/problem.component';



@NgModule({
  declarations: [
    ProblemComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ProblemComponent
  ]
})
export class MarketplaceModule { }
