import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/keypoint.model';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {}

  distance = new BehaviorSubject<any>({distance: 0, tourId: 0})
  currentDistance = this.distance.asObservable()

  search(street: string): Observable<any> {
    return this.http.get(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }

  updateDistance(distance: any): void {
    this.distance.next(distance)
  }


}
