import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourPreference } from '../../shared/model/tour-preference.model';

@Injectable({
  providedIn: 'root'
})
export class TourPreferenceService {

  private apiUrl = 'https://localhost:44333/api/tourist/preference/preferences';

  constructor(private http: HttpClient) { }

  getPreferences(): Observable<TourPreference[]> {
    return this.http.get<TourPreference[]>(this.apiUrl);
  }
}
