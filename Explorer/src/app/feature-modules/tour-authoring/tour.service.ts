import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { Tour } from "./model/tour.model";
import { Equipment } from "./model/equipment.model";
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

    getEquipment(): Observable<PagedResults<Equipment>> {
      return this.http.get<PagedResults<Equipment>>('https://localhost:44333/api/author/equipment?page=0&pageSize=0') 
    }

    getTourEquipment(id: number): Observable<PagedResults<Equipment>> {
      return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'author/tour/tourEquipment/' + id);  
    }
    

    getTour(id: Number): Observable<Tour> {
      return this.http.get<Tour>('https://localhost:44333/api/author/tour/' + id);
    }
    getByIdTour(id: Number): Observable<Tour> {
      return this.http.get<Tour>(`https://localhost:44333/api/author/tour/getByTourId/${id}`);

    }

    addTourEquipment(tourId: number, equipmentIds: number[]): Observable<any> { 
      return this.http.post<Tour>('https://localhost:44333/api/author/tour/' + tourId + '/equipment', equipmentIds);
    }

    removeEquipmentFromTour(equipmentId: number, tourId: number): Observable<Tour> {
      return this.http.delete<Tour>(`https://localhost:44333/api/author/tour/${tourId}/equipment/${equipmentId}`);
    }

    archiveTour(tour: Tour): Observable<Tour> {
      return this.http.put<Tour>('https://localhost:44333/api/author/tour/archive/' + tour.id, tour.userId);
    }

    publishTour(tour: Tour): Observable<Tour> {
      return this.http.put<Tour>('https://localhost:44333/api/author/tour/publish/' + tour.id, tour.userId);
    }

    reactivateTour(tour: Tour): Observable<any> {
      return this.http.put('https://localhost:44333/api/author/tour/reactivate/' + tour.id, tour.userId);
    }

    getAuthorIdByTourId(tourId: number): Observable<number> {
      return this.http.get<number>(`${environment.apiHost}person/tourist/getAuthor/${tourId}`);
    }
  
    getAllTours(): Observable<Tour[]> {
      return this.http.get<Tour[]>(`${environment.apiHost}tourist/tour/getAllTours`);
    }

  }