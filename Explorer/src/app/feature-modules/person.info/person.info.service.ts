import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonInfo } from './model/info.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Equipment } from './model/equipment.model';
@Injectable({
  providedIn: 'root'
})
export class PersonInfoService {

  constructor(private http: HttpClient) { }

  getTouristInfo(personId: number): Observable<PersonInfo> {
    return this.http.get<PersonInfo>(`${environment.apiHost}tourist/person/${personId}`);
  }

  updateTouristInfo(info: PersonInfo): Observable<PersonInfo> {
    return this.http.put<PersonInfo>(`${environment.apiHost}tourist/person/${info.id}`, info);
  }

  getAuthorInfo(personId: number): Observable<PersonInfo> {
    return this.http.get<PersonInfo>(`${environment.apiHost}author/person/${personId}`);
  }

  updateAuthorInfo(info: PersonInfo): Observable<PersonInfo> {
    return this.http.put<PersonInfo>(`${environment.apiHost}author/person/${info.id}`, info);
  }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }
}
