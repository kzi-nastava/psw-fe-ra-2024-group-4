import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PositionSimulator } from '../tour-authoring/model/position-simulator.model';
import { environment } from 'src/env/environment';
import { TourExecution } from '../tour-authoring/model/tour-execution.model';
import { KeyPoint } from '../tour-authoring/model/keypoint.model';


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
        {} 
    );
  }

  abandonTourExecution(executionId: number): Observable<TourExecution> {
    return this.http.post<TourExecution>(
        environment.apiHost + 'tourist/execution/abandon/' + executionId,
        {} 
    );
  }

  completeKeyPoint(executionId: number, keyPointId: number): Observable<TourExecution> {
    return this.http.put<TourExecution>(
      `${environment.apiHost}tourist/completeKeyPoint/${executionId}/${keyPointId}`,
      {} // Dodavanje praznog objekta kao telo, ako je potrebno
    );
  }
  

  getTourExecutionByTourAndTourist(touristId: number, tourId: number): Observable<TourExecution> {
    return this.http.get<TourExecution>(`${environment.apiHost}tourist/execution/by_tour_and_tourist/${touristId}/${tourId}`);
  }

  getKeyPointsForTour(tourId: number): Observable<KeyPoint[]> {
    return this.http.get<KeyPoint[]>('https://localhost:44333/api/tourist/execution/' + tourId + '/keypoints'); // Slanje GET zahteva i vraćanje Observable-a

  }

  getActiveTour(touristId: number): Observable<TourExecution> {
    return this.http.get<TourExecution>(`${environment.apiHost}tourist/execution/active/${touristId}`);
  }

}

