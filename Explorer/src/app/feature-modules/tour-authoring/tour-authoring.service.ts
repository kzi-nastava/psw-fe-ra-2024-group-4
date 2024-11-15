import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeyPoint } from './model/keypoint.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/env/environment';
import { Tour } from './model/tour.model';
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

  addObject(object: TourObject): Observable<TourObject> {
    return this.http.post<TourObject>(environment.apiHost +'objectaddition/object/', object);
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

  addKeyPointToTour(tour: Tour, keypointid: number | undefined = -1)
  {
    return this.http.put<Tour>(environment.apiHost + 'author/tour/keypointaddition/' +  keypointid, tour);
  }

  updateObject(object: TourObject): Observable<TourObject> {
    return this.http.put<TourObject>(environment.apiHost + 'objectaddition/object/' + object.id, object);
  }

  updateTourDuration(tourId: number, duration: number, transportation: string): Observable<any> {
    const params = new HttpParams()
      .set('transportation', transportation)
      .set('duration', duration.toFixed(2));
    
    return this.http.put(`${environment.apiHost}author/tour/add-duration/${tourId}`, null, { params });
  }

  deleteAllDurations(tourId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiHost}author/tour/delete-all-durations/${tourId}`);
  } //Http failure response for https://localhost:44333/api//delete-all-durations/0: 404 OK
  
  


  getNextKeypointId(userId: number) : Observable<number>{
    return this.http.get<number>(environment.apiHost + 'keypointaddition/keypoint/next-id/' + userId);
  }

  updateTourDistance(id: number, length: number): Observable<any> {
    console.log('pozvana funksija iz servisa'+length+id);
    return this.http.put('https://localhost:44333/api/author/tour/updateDistance/'+ id, length);
  }

}
