import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from './model/problem.model';
import { Equipment } from '../administration/model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getProblems(): Observable<PagedResults<Problem>>{
    return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/problem?page=0&pageSize=0');
  }

  deleteProblem(id: number): Observable<Problem>{
    return this.http.delete<Problem>('https://localhost:44333/api/problem/'+id);
  }

  addProblem(problem: Problem): Observable<Problem>{
    return this.http.post<Problem>('https://localhost:44333/api/problem', problem);
  }

  
}
