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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    MykeypointsComponent,
    ObjectViewComponent,
    FirstPageComponent,
    AppReviewComponent,
    LandingBlogComponent,
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
    AdministrationModule,
    MatFormFieldModule,
    MatInputModule, 

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
