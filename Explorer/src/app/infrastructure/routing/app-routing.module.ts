import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AppReviewTableComponent } from 'src/app/feature-modules/administration/app-review-table/app-review-table.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ClubJoinRequestComponent } from 'src/app/feature-modules/administration/club-join-request/club-join-request.component';
import { ClubDetailsComponent } from 'src/app/feature-modules/administration/club-details/club-details.component';
import { InfoComponent } from 'src/app/feature-modules/person.info/info/info.component'; 
import { ClubComponent } from 'src/app/feature-modules/administration/club/club.component';
import { PostComponent } from 'src/app/feature-modules/blog/post/post.component';
import { CommentComponent } from 'src/app/feature-modules/blog/comment/comment.component';
import { AccountComponent } from 'src/app/feature-modules/administration/account/account.component';
import { MykeypointsComponent } from 'src/app/feature-modules/layout/mykeypoints/mykeypoints.component';
import { ToursForAuthorComponent } from 'src/app/feature-modules/marketplace/tours-for-author/tours-for-author.component';
import { CreateTourComponent } from 'src/app/feature-modules/tour-authoring/create-tour/create-tour.component';
import { NecessaryEquipmentComponent } from 'src/app/feature-modules/tour-authoring/necessary-equipment/necessary-equipment.component';
import { ObjectViewComponent } from 'src/app/feature-modules/layout/object-view/object-view.component';
import { AppReviewComponent } from 'src/app/feature-modules/layout/app-review/app-review.component';
import { PersonEquipmentComponent } from 'src/app/feature-modules/person.info/person-equipment/person-equipment.component';
import { TourOverviewComponent } from 'src/app/feature-modules/tour-authoring/tour-overview/tour-overview.component';
import { TourReviewsComponent } from 'src/app/feature-modules/marketplace/tour-reviews/tour-reviews.component';
import { ProblemComponent } from 'src/app/feature-modules/marketplace/problem/problem.component';
import { TourPreferencesComponent } from 'src/app/feature-modules/tour-authoring/tour-preferences/tour-preferences.component';
import { TourPreferencesFormComponent } from 'src/app/feature-modules/tour-authoring/tour-preferences-form/tour-preferences-form.component';
import { ProblemTicketComponent } from 'src/app/feature-modules/marketplace/problem-ticket/problem-ticket.component';
import { NotificationsComponent } from 'src/app/feature-modules/administration/notifications/notifications.component';
import { CartOverviewComponent } from 'src/app/feature-modules/payments/cart-overview/cart-overview.component';
import { PurchaseTokenComponent } from '../../feature-modules/purchase-token/purchase-token.component';
import { TourReviewFormComponent } from 'src/app/feature-modules/marketplace/tour-review-form/tour-review-form.component';
import { QuizComponent } from 'src/app/feature-modules/administration/quiz/quiz.component';

import { PositionSimulatorComponent } from 'src/app/feature-modules/tour-execution/position-simulator/position-simulator.component';
import { PublicStatusRequestComponent } from 'src/app/feature-modules/administration/public-status-request/public-status-request.component';
import { TourDetailsNewComponent } from 'src/app/feature-modules/tour-authoring/tour-details-new/tour-details-new.component';



const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
  {path: 'blogPost',component: PostComponent,canActivate: [AuthGuard]},
  {path: 'aboutPost/:postId', component: CommentComponent, canActivate: [AuthGuard] }, 
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'clubDetails/:clubid', component: ClubDetailsComponent, canActivate: [AuthGuard],},
  {path: 'profile', component: InfoComponent },
  {path: 'club', component: ClubComponent, canActivate: [AuthGuard],},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'mykeypoints', component: MykeypointsComponent},
  {path: 'author-tours', component: ToursForAuthorComponent},
  {path: 'tour-details/:id', component: TourDetailsNewComponent},
  {path: 'create-tour', component: CreateTourComponent},
  {path: 'tour/:id/equipment', component: NecessaryEquipmentComponent },
  {path: 'object-view', component: ObjectViewComponent},
  {path: 'appReviews', component: AppReviewTableComponent, canActivate: [AuthGuard],},
  {path: 'reviewApp', component: AppReviewComponent,canActivate: []},
  {path: 'clubJoinRequest', component: ClubJoinRequestComponent},
  {path: 'touristEquipment', component: PersonEquipmentComponent},
  {path: 'tourReviews', component: TourReviewsComponent},
  {path: 'problem', component: ProblemComponent, canActivate: [AuthGuard]},
  {path: 'problem-ticket', component: ProblemTicketComponent},
  {path: 'tour-preferences', component: TourPreferencesComponent },
  {path: 'tour-preferences-form', component: TourPreferencesFormComponent},
  {path: 'notifications',component:NotificationsComponent},
  {path: 'position-simulator', component: PositionSimulatorComponent},
  {path: 'tour-overview', component: TourOverviewComponent},
  {path: 'public-status-request', component: PublicStatusRequestComponent},
  {path: 'cart/:cartId', component: CartOverviewComponent},
  {path: 'purchased-tours', component: PurchaseTokenComponent },
  {path: 'tour-review/:tourId', component: TourReviewFormComponent},
  {path: 'equipment', component: EquipmentComponent},
  {path: 'quiz', component: QuizComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
