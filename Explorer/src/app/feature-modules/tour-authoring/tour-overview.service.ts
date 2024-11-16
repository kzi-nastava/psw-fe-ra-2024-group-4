import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { TourOverview } from './model/touroverview.model';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourReview } from '../marketplace/model/tour-reviews.model';

@Injectable({
  providedIn: 'root'
})
export class TourOverviewService {

  private apiUrl = `${environment.apiHost}tour/tourOverview`

  constructor(private http: HttpClient) { }

  getAllWithoutReviews(): Observable<PagedResults<TourOverview>> {
    return this.http.get<PagedResults<TourOverview>>(`${this.apiUrl}`);
  }

  getReviewsByTourId(tourId: number): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>(`${this.apiUrl}/${tourId}`);
  }

  getToursByKeyPointLocation(longitude: number, latitude: number, distance:number):Observable<PagedResults<TourOverview>>{
    const url = `${this.apiUrl}/search/${longitude};${latitude};${distance}`;
    return this.http.get<PagedResults<TourOverview>>(url);
  }

}
