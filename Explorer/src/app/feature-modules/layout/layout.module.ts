import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { MykeypointsComponent } from './mykeypoints/mykeypoints.component';
import { TourAuthoringModule } from "../tour-authoring/tour-authoring.module";

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    MykeypointsComponent,
   
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TourAuthoringModule
],
  exports: [
    NavbarComponent,
    HomeComponent,
    MykeypointsComponent
  ]
})
export class LayoutModule { }
