import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Encounter } from './model/encounter.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import {  Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncounterServiceService {

  constructor(private http:HttpClient) { }

  createEncounter(encounter: Encounter): Observable<Encounter> {
    return this.http.post<Encounter>(environment.apiHost + 'encounters/create', encounter)
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
      map((response) => response.value) 
    );
  }

  GetByLatLong(latitude: number, longitude: number): Observable<Encounter> {
    const params = { latitude: latitude.toString(), longitude: longitude.toString() };
    console.log("Making HTTP request with params:", params);

    return this.http.get<{ value: Encounter }>(`${environment.apiHost}encounters`, { params }).pipe(
        map((response) => {
            console.log("Response from server (GetByLatLong):", response);
            return response.value; 
        })
    );
}

  activateEncounter(encounterId: number, latitude: number, longitude: number): Observable<Encounter> {
    const url = `${environment.apiHost}encounters/${encounterId}/activate`;
    const body = { latitude, longitude };

    console.log("Sending activation request:", { encounterId, latitude, longitude });

    return this.http.post<{ value: Encounter }>(url, body).pipe(
        map((response) => {
            console.log("Response from server (activateEncounter):", response);
            return response.value;
        })
    );
  }

  completeEncounter(encounterId: number): Observable<Encounter> {
    const url = `${environment.apiHost}encounters/${encounterId}/complete`;
  
    console.log("Sending completion request:", { encounterId });
  
    return this.http.post<{ value: Encounter }>(url, {}).pipe(
      map((response) => {
        console.log("Response from server (completeEncounter):", response);
        return response.value;
      })
    );
  }

  getAllActiveForUser(touristId: number): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(`${environment.apiHost}encounters/getAllActive/${touristId}`);
  }
}
