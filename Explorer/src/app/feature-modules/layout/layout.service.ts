import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppReview } from '../administration/model/appreview.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Post } from '../blog/model/post.model';
import { TourOverview } from '../tour-authoring/model/touroverview.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }


  //FrontPage unauthorized endpoints
  getAllWithoutReviews(): Observable<PagedResults<TourOverview>> {
      return this.http.get<PagedResults<TourOverview>>(`https://localhost:44333/api/frontPage/tours`);
  }

  getPosts():Observable<PagedResults<Post>>{
      return this.http.get<PagedResults<Post>>(`https://localhost:44333/api/frontPage/posts`);
  }




  

  //AppReviews

  getTouristReview(id: number): Observable<AppReview> {
    return this.http.get<AppReview>(environment.apiHost + 'tourist/appReview/'+ id)
  }

  addTouristReview(appReview: AppReview): Observable<AppReview> {
    return this.http.post<AppReview>(environment.apiHost + 'tourist/appReview', appReview);
  }

  updateTouristReview(appReview: AppReview): Observable<AppReview> {
    return this.http.put<AppReview>(environment.apiHost + 'tourist/appReview/'+ appReview.userId, appReview);
  }

  getAuthorReview(id: number): Observable<AppReview> {
    return this.http.get<AppReview>(environment.apiHost + 'author/appReview/'+ id)
  }

  addAuthorReview(appReview: AppReview): Observable<AppReview> {
    return this.http.post<AppReview>(environment.apiHost + 'author/appReview', appReview);
  }

  updateAuthorReview(appReview: AppReview): Observable<AppReview> {
    return this.http.put<AppReview>(environment.apiHost + 'author/appReview/'+ appReview.userId, appReview);
  }
}
