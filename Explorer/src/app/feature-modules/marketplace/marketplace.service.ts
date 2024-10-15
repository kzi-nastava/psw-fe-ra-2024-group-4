import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { tourReview } from './model/tour-reviews.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http : HttpClient) { }

  getTourReviews(): Observable<PagedResults<tourReview>>
  {
    return this.http.get<PagedResults<tourReview>>('https://localhost:44333/api/tourReviewing/tourReview');
  }
}
