import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from './model/problem.model';
import { environment } from 'src/env/environment';
import { Equipment } from '../administration/model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getProblems(): Observable<PagedResults<Problem>>{
    return this.http.get<PagedResults<Problem>>(environment.apiHost + 'problem');
  }

  deleteProblem(id: number): Observable<Problem>{
    return this.http.delete<Problem>(environment.apiHost + 'problem' + id);
  }

  addProblem(problem: Problem): Observable<Problem>{
    return this.http.post<Problem>(environment.apiHost + 'problem', problem);
  }
  
}
