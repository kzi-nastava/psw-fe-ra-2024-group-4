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
import { ProblemTicketComponent } from './problem-ticket/problem-ticket.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatChipsModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule, 
    MatNativeDateModule,
  ],
  exports: [
    ToursForAuthorComponent,
    ProblemComponent,
    TourReviewsComponent
  ]
})
export class MarketplaceModule { }
