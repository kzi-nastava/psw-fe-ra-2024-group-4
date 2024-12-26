import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourPreference } from '../../shared/model/tour-preference.model';
import {jwtDecode } from 'jwt-decode';
import { environment } from 'src/env/environment';
@Injectable({
  providedIn: 'root'
})


export class TourPreferenceService{

  // private apiUrl = 'http://localhost:44333/api/tourist/preference';  
  private apiUrl = `${environment.apiHost}tourist/preference`

  constructor(private http: HttpClient) { }

  getPreferences(): Observable<TourPreference[]> {
    return this.http.get<TourPreference[]>(`${this.apiUrl}/preferences`);
  }
  getTourPreference(): Observable<TourPreference | null> {
    const token = localStorage.getItem('access-token');
    if(token){
      const decodedToken : any = jwtDecode(token);
      const touristId = decodedToken.id;
      return this.http.get<TourPreference | null>(`${this.apiUrl}/${touristId}`);
    } else{
      throw new Error('Token not found');
    }
  }
  savePreference(preference: TourPreference) {
    const token =localStorage.getItem('access-token');
    if(token){
      const decodedToken: any = jwtDecode(token);
      const touristId = decodedToken.id;
      if (preference.id) {
        return this.http.put(`${this.apiUrl}/${touristId}`, preference); // Update preference
      } else {
        return this.http.post(`${this.apiUrl}/${touristId}`, preference); // Add new preference
      }
    } else {
      throw new Error('Token not found');
    }
    
  }
  hasTourPreference(): Observable<boolean> {
    const token = localStorage.getItem('access-token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const touristId = decodedToken.id;
      return this.http.get<boolean>(`${this.apiUrl}/has-preference/${touristId}`);
    } else {
      throw new Error('Token not found');
    }
  }
  
  
}
