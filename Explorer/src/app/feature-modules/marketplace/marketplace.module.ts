import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemComponent } from './problem/problem.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProblemFormComponent } from './problem-form/problem-form.component';



@NgModule({
  declarations: [
    ProblemComponent,
    ProblemFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports:[
    ProblemComponent
  ]
})
export class MarketplaceModule { }
