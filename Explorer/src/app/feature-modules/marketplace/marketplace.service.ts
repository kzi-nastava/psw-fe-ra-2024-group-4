import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from './model/problem.model';
import { environment } from 'src/env/environment';
import { Equipment } from '../administration/model/equipment.model';
import { TourReview } from './model/tour-reviews.model';
import { ProblemComment } from './model/problem-comment.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { Notification } from '../administration/model/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getProblems(): Observable<PagedResults<Problem>>{
    return this.http.get<PagedResults<Problem>>(environment.apiHost + 'problem');
  }

  getProblemsByTouristId(id:number): Observable<Problem[]>{
    console.log('hgh');
    return this.http.get<Problem[]>(environment.apiHost + 'problem/byTourist/'+id);
  }


  deleteProblem(id: number): Observable<Problem>{
    return this.http.delete<Problem>(environment.apiHost + 'problem/' + id);
  }

  addProblem(problem: Problem): Observable<Problem>{
    return this.http.post<Problem>(environment.apiHost + 'problem', problem);
  }

  getTourReviews(): Observable<PagedResults<TourReview>>
  {
    return this.http.get<PagedResults<TourReview>>(environment.apiHost + 'tourReviewing/tourReview');
  }

  getTourReview(userId: number, tourId: number): Observable<TourReview>
  {
    return new Observable<TourReview>
  }
  
  addTourReview(tourReview : TourReview): Observable<TourReview>
  {
    return this.http.post<TourReview>(environment.apiHost + 'tourReviewing/tourReview', tourReview);
  }

  updateTourReview(tourReview : TourReview): Observable<TourReview>{
    return this.http.put<TourReview>(environment.apiHost + 'tourReviewing/tourReview/' + tourReview.id, tourReview);
  }

  deleteTourReview(tourReview : TourReview): Observable<TourReview>{
    return this.http.delete<TourReview>(environment.apiHost + 'tourReviewing/tourReview/' + tourReview.id);
  }

  postProblemCommentAsTourist(comment : ProblemComment): Observable<Problem>{
    return this.http.post<Problem>(environment.apiHost + 'problem/tourist/postComment', comment);
  }
  postProblemCommentAsAuthor(comment : ProblemComment): Observable<Problem>{
    return this.http.post<Problem>(environment.apiHost + 'author/problem/postComment', comment);
  }

  updateProblemStatus(id: number, isActive: boolean): Observable<Problem> {
    return this.http.put<Problem>(environment.apiHost + `problem/updateStatus/${id}`, isActive);
  }
  closedProblemStatus(id: number, isActive: boolean): Observable<Problem> {
    return this.http.put<Problem>(environment.apiHost + `problem/close/${id}`, isActive);
  }
  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + `admin/tour/${id}`);
  }
  deleteProblemWithTour(id: number): Observable<Problem>{
    return this.http.delete<Problem>(environment.apiHost + `problem/admin/${id}`);
  }

  //turista
  getProblemById(id: number): Observable<Problem> {
    return this.http.get<Problem>(environment.apiHost + `problem/find/${id}`);
  }
  //autor
  getAuthorProblemById(id: number): Observable<Problem> {
    return this.http.get<Problem>(environment.apiHost + `author/problem/find/${id}`);
  }
  // getAdminProblemById(id: number): Observable<Problem> {
  //   return this.http.get<Problem>(environment.apiHost + `problem/admin/${id}`);
  // }

  getTourById(id: number,  role: 'tourist' | 'author' | 'admin' ): Observable<Tour> {
    return this.http.get<Tour>(`${environment.apiHost}${role}/tour/getByTourId/${id}`);
  }
  updateProblem(problem: Problem): Observable<Problem> {
    return this.http.put<Problem>(`${environment.apiHost}problem/updateProblem/${problem.id}`, problem);
} 
  //da kreira notifikaciju-kada postacvi rok-notifikacija se salje autoru ture
  createAdminNotification(notification:Notification):Observable<Notification>{
    return this.http.post<Notification>(`${environment.apiHost}administrator/notification`, notification)
  }
  createNotification(notification:Notification,role:'tourist' | 'author' | 'administrator'){
    return this.http.post<Tour>(`${environment.apiHost}${role}/notification`,notification);

  }
}
