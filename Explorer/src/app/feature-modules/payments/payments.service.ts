import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Bundle } from '../tour-authoring/model/budle.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  addBundle(bundle: Bundle): Observable<Bundle>{
    return this.http.post<Bundle>(environment.apiHost + 'author/bundles', bundle);
  }

  getAllWithoutTours(): Observable<PagedResults<Bundle>> {
    return this.http.get<PagedResults<Bundle>>(environment.apiHost + 'tourist/bundles');
  }
}
