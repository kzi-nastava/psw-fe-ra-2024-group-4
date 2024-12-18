import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
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
import { AboutUsComponent } from './about-us/about-us.component';
import { TeamComponent } from './about-us/team/team.component';
import { PurposeComponent } from './about-us/purpose/purpose.component';
import { AboutAppComponent } from './about-us/about-app/about-app.component';

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
    HeaderComponent,
    AboutUsComponent,
    TeamComponent,
    PurposeComponent,
    AboutAppComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TourAuthoringModule,
    ReactiveFormsModule,
    MatMenuModule,
    AdministrationModule ,
    MatTabsModule,
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
