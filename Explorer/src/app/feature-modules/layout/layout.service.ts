import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppReview } from '../administration/model/appreview.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }

  getReview(id: number): Observable<AppReview> {
    return this.http.get<AppReview>(environment.apiHost + 'person/appReview/'+ id)
  }

  addReview(appReview: AppReview): Observable<AppReview> {
    return this.http.post<AppReview>(environment.apiHost + 'person/appReview', appReview);
  }

  updateReview(appReview: AppReview): Observable<AppReview> {
    return this.http.put<AppReview>(environment.apiHost + 'person/appReview/'+ appReview.userId, appReview);
  }
}
