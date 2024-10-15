import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeyPoint } from './model/keypoint.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Tour } from './model/tour.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { 
    
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

  getKeyPointById(id: number): Observable<KeyPoint>{
    return this.http.get<KeyPoint>(environment.apiHost + 'keypointaddition/keypoint/getbyid/' + id);
  }

  addKeyPointToTour(tourid: number | undefined = -1, keypointid: number | undefined = -1, userid: number)
  {
    return this.http.post<Tour>(environment.apiHost + 'author/tour/' + tourid + '/keypointaddition/' + keypointid + '/' + userid, keypointid);
  }
}
