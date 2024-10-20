import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonInfo } from './model/info.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonInfoService {

  constructor(private http: HttpClient) { }

  getPersonInfo(personId: number): Observable<PersonInfo> {
    return this.http.get<PersonInfo>(`${environment.apiHost}person/${personId}`);
  }

  updatePersonInfo(info: PersonInfo): Observable<PersonInfo> {
    return this.http.put<PersonInfo>(`${environment.apiHost}person/${info.id}`, info);
  }

}
