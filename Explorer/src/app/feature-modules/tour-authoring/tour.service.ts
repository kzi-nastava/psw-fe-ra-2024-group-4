import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { Tour } from "./model/tour.model";
import { environment } from "src/env/environment";

@Injectable({
    providedIn: 'root'
  })
  export class TourService {

    constructor(private http: HttpClient) { }
  
    getToursForAuthor(id: number): Observable<Tour[]> {
        return this.http.get<Tour[]>(`${environment.apiHost}author/tour/${id}`);
      }
  
    addTour(tour: Tour): Observable<Tour> {
      return this.http.post<Tour>(environment.apiHost + 'author/tour', tour);
    }
  }