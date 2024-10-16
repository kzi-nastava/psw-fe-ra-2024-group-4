import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeyPoint } from './model/keypoint.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TourObject } from './model/object.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { 
    
  }

  getObjects(): Observable<PagedResults<TourObject>> {
    return this.http.get<PagedResults<TourObject>>(environment.apiHost + 'objectaddition/object');
  }

  getKeyPoints(userId: number): Observable<KeyPoint[]> {
    return this.http.get<KeyPoint[]>(environment.apiHost + 'keypointaddition/keypoint/getbyuser/' + userId);
  }

  createKeyPoint(keypoint: KeyPoint): Observable<KeyPoint>{
    return this.http.post<KeyPoint>(environment.apiHost + 'keypointaddition/keypoint', keypoint);
  }

  updateKeyPoint(keypoint: KeyPoint): Observable<KeyPoint>{
    return this.http.put<KeyPoint>(environment.apiHost + 'keypointaddition/keypoint/' + keypoint.id, keypoint);
  }

  deleteKeyPoint(id: number): Observable<KeyPoint>{
    return this.http.delete<KeyPoint>(environment.apiHost + 'keypointaddition/keypoint/' + id);
  }
}
