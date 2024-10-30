import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PositionSimulator } from '../tour-authoring/model/position-simulator.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getPositionByTourist(touristId: number): Observable<PositionSimulator>{
    return this.http.get<PositionSimulator>(environment.apiHost + 'tourist/positionSimulator/getbytourist/' + touristId );
  }

  addPosition(object: PositionSimulator): Observable<PositionSimulator>{
    return this.http.post<PositionSimulator>(environment.apiHost + 'tourist/positionSimulator', object);
  }

  updatePosition(object: PositionSimulator): Observable<PositionSimulator>{
    return this.http.put<PositionSimulator>(environment.apiHost + 'tourist/positionSimulator/' + object.id, object);
  }
}
