import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToursForAuthorComponent } from './tours-for-author/tours-for-author.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ToursForAuthorComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ToursForAuthorComponent
  ]
})
export class MarketplaceModule { }
