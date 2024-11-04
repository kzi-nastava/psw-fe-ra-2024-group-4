import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PositionSimulator } from '../tour-authoring/model/position-simulator.model';
import { environment } from 'src/env/environment';
import { TourExecution } from '../tour-authoring/model/tour-execution.model';

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

  startTourExecution(object: TourExecution): Observable<TourExecution>{
    return this.http.post<TourExecution>(environment.apiHost + 'tourist/execution', object);
  }

  completeTourExecution(executionId: number): Observable<TourExecution> {
    return this.http.post<TourExecution>(
        environment.apiHost + 'tourist/execution/complete/' + executionId,
        {} // Adding an empty object as the body
    );
  }

  abandonTourExecution(executionId: number): Observable<TourExecution> {
    return this.http.post<TourExecution>(
        environment.apiHost + 'tourist/execution/abandon/' + executionId,
        {} // Adding an empty object as the body
    );
  }

  completeKeyPoint(executionId: number, keyPointId: number): Observable<TourExecution> {
    return this.http.put<TourExecution>(
      `${environment.apiHost}tour/completeKeyPoint/${executionId}/${keyPointId}`,
      {} // Dodavanje praznog objekta kao telo, ako je potrebno
    );
  }
  

}

