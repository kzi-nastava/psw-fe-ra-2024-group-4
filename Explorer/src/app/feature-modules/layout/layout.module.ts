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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AboutUsComponent } from './about-us/about-us.component';
import { TeamComponent } from './about-us/team/team.component';
import { PurposeComponent } from './about-us/purpose/purpose.component';
import { AboutAppComponent } from './about-us/about-app/about-app.component';
import { FooterComponent } from './footer/footer.component';
import { MarkdownModule } from 'ngx-markdown';
import { PopupsModule } from '../badges/popups/popups.module';

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
    HeaderComponent,
    AboutUsComponent,
    TeamComponent,
    PurposeComponent,
    AboutAppComponent,
    FooterComponent

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
    AdministrationModule ,
    MatTabsModule,
    MarkdownModule,
    PopupsModule
],
  exports: [
    NavbarComponent,
    HomeComponent,
    MykeypointsComponent,
    LandingBlogComponent,
    AppReviewComponent,
    HeaderComponent,
    FooterComponent
  ],
  
})
export class LayoutModule { }
