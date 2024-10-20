import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppReviewComponent } from './app-review/app-review.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MykeypointsComponent } from './mykeypoints/mykeypoints.component';
import { TourAuthoringModule } from "../tour-authoring/tour-authoring.module";
import { ObjectViewComponent } from './object-view/object-view.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    MykeypointsComponent,
    ObjectViewComponent,
    
    AppReviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TourAuthoringModule,
    ReactiveFormsModule
],
  exports: [
    NavbarComponent,
    HomeComponent,
    MykeypointsComponent,
    AppReviewComponent
  ],
  
})
export class LayoutModule { }
