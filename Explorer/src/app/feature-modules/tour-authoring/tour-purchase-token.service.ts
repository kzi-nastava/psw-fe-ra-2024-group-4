import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TourPurchaseToken } from '../payments/model/tour-purchase-token.model';
import { environment } from 'src/env/environment';
import { Tour } from './model/tour.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = `${environment.apiHost}shopping/token`
  private apiUrl2 = `${environment.apiHost}person/tourist/tour`

  constructor(private http: HttpClient) {}

  getUserPurchasedTours(userId: number): Observable< TourPurchaseToken[]> {
    return this.http.get<TourPurchaseToken[]>(`${this.apiUrl}/getAllFromUser/${userId}`).pipe(
    catchError(error => {
        console.error('Error fetching purchased tours:', error);
        return throwError(error);
      }))
  }

  getTour(tourId: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl2}/${tourId}`);
  }

}
