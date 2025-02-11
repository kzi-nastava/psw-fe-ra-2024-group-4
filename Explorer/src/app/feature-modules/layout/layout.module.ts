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
import { FirstPageComponent } from './first-page/first-page.component';
import { MatMenuModule } from '@angular/material/menu';
import { LandingBlogComponent } from './landing-blog/landing-blog.component';
import { AdministrationModule } from '../administration/administration.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    MykeypointsComponent,
    ObjectViewComponent,
    FirstPageComponent,
    AppReviewComponent,
    AppReviewComponent,
    LandingBlogComponent,
    AppReviewComponent,
    HeaderComponent,
    HeaderComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TourAuthoringModule,
    ReactiveFormsModule,
    MatMenuModule,
    AdministrationModule 

],
  exports: [
    NavbarComponent,
    HomeComponent,
    MykeypointsComponent,
    LandingBlogComponent,
    AppReviewComponent,
    HeaderComponent
  ],
  
})
export class LayoutModule { }
