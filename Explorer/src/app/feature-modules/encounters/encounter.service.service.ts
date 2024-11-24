import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Encounter } from './model/encounter.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncounterServiceService {

  constructor(private http:HttpClient) { }

  createEncounter(encounter: Encounter): Observable<Encounter> {
    return this.http.post<Encounter>(environment.apiHost + 'encounters/create', encounter);
  }

  getInRadius(radius: number, lat: number, lon: number): Observable<PagedResults<Encounter>> {
    const url = `${environment.apiHost}encounters/radius`; // Base URL
    const params = new HttpParams()
      .set('radius', radius.toString())
      .set('lat', lat.toString())
      .set('lon', lon.toString()); // Add query parameters

      console.log('Šaljem parametre na server:', {
        radius,
        lat,
        lon});
  
    return this.http.get<{ value: PagedResults<Encounter> }>(url, { params }).pipe(
      map((response) => response.value) // Ekstrahuj `value` koji sadrži `results` i `totalCount`
    );
  }
  
}
