import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeyPoint } from './model/keypoint.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { 
    
  }

  getKeyPoints(userId: number): Observable<KeyPoint[]> {
    return this.http.get<KeyPoint[]>('https://localhost:44333/api/keypointaddition/keypoint/getbyuser/' + userId);
  }
}
