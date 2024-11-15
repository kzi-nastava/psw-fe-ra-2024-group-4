import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemComponent } from './problem/problem.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';
import { ToursForAuthorComponent } from './tours-for-author/tours-for-author.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { TourAuthoringModule } from '../tour-authoring/tour-authoring.module';
import { KeypointDialogComponent } from './keypoint-dialog/keypoint-dialog.component';
import { TourReviewsComponent } from './tour-reviews/tour-reviews.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { ProblemTicketComponent } from './problem-ticket/problem-ticket.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [ToursForAuthorComponent, KeypointDialogComponent, ProblemComponent,ProblemFormComponent, TourReviewsComponent, TourReviewFormComponent, ProblemTicketComponent], 
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TourAuthoringModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule
  ],
  exports: [
    ToursForAuthorComponent,
    ProblemComponent,
    TourReviewsComponent
  ]
})
export class MarketplaceModule { }
