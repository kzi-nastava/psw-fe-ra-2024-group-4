import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourPreference } from '../../shared/model/tour-preference.model';
import {jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})


export class TourPreferenceService{

  private apiUrl = 'https://localhost:44333/api/tourist/preference/preferences';  

  constructor(private http: HttpClient) { }

  getPreferences(): Observable<TourPreference[]> {
    return this.http.get<TourPreference[]>(this.apiUrl);
  }
  savePreference(preference: TourPreference) {
    const token =localStorage.getItem('access-token');
    if(token){
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken);
      const touristId = decodedToken.id;
      if (preference.id) {
        return this.http.put(`https://localhost:44333/api/tourist/preference/${touristId}`, preference); // Update preference
      } else {
        return this.http.post(`https://localhost:44333/api/tourist/preference/${touristId}`, preference); // Add new preference
      }
    } else {
      throw new Error('Token not found');
    }
    
  }
  
}
