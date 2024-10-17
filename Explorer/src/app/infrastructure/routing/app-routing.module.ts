import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AppReviewTableComponent } from 'src/app/feature-modules/administration/app-review-table/app-review-table.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { AccountComponent } from 'src/app/feature-modules/administration/account/account.component';
import { MykeypointsComponent } from 'src/app/feature-modules/layout/mykeypoints/mykeypoints.component';
import {ToursForAuthorComponent } from 'src/app/feature-modules/marketplace/tours-for-author/tours-for-author.component';
import { CreateTourComponent } from 'src/app/feature-modules/tour-authoring/create-tour/create-tour.component';
import { NecessaryEquipmentComponent } from 'src/app/feature-modules/tour-authoring/necessary-equipment/necessary-equipment.component';

import { ObjectViewComponent } from 'src/app/feature-modules/layout/object-view/object-view.component';
import { AppReviewComponent } from 'src/app/feature-modules/layout/app-review/app-review.component';
import { InfoComponent } from 'src/app/feature-modules/person.info/info/info.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'mykeypoints', component: MykeypointsComponent},
  {path: 'author-tours', component: ToursForAuthorComponent},
  {path: 'create-tour', component: CreateTourComponent},
  {path: 'tour/:id/equipment', component: NecessaryEquipmentComponent },
  {path: 'object-view', component: ObjectViewComponent},
  {path: 'appReviews', component: AppReviewTableComponent, canActivate: [AuthGuard],},
  {path: 'reviewApp', component: AppReviewComponent,canActivate: []},
  { path: 'profile', component: InfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
