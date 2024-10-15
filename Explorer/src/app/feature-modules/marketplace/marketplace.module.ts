import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewsComponent } from './tour-reviews/tour-reviews.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { AdministrationModule } from "../administration/administration.module";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TourReviewsComponent,
    TourReviewFormComponent
  ],
  imports: [
    CommonModule,
    AdministrationModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialModule,
    ReactiveFormsModule
],
  exports: [
    TourReviewsComponent
  ]
  
})
export class MarketplaceModule { }
