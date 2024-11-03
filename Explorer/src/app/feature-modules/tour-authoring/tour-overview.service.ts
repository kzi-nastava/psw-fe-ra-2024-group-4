import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { TourOverview } from './model/touroverview.model';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourOverviewService {

  private apiUrl = `${environment.apiHost}person/tourOverview`

  constructor(private http: HttpClient) { }

  getAllWithoutReviews(): Observable<PagedResults<TourOverview>> {
    return this.http.get<PagedResults<TourOverview>>(`${this.apiUrl}`);
  }
}
