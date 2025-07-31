import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Bundle } from '../tour-authoring/model/budle.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { PaymentRecord } from './model/payment-record.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  addBundle(bundle: Bundle): Observable<Bundle>{
    return this.http.post<Bundle>(environment.apiHost + 'author/bundles', bundle);
  }

  getBundlesByAuthorId(authorId: number): Observable<PagedResults<Bundle>> {
    return this.http.get<PagedResults<Bundle>>(`${environment.apiHost}author/bundles/byauthor/${authorId}`);
  }

  putBundle(bundleId: number, bundle: Bundle): Observable<Bundle> {
    return this.http.put<Bundle>(`${environment.apiHost}author/bundles/${bundleId}`, bundle);
  }  

  deleteBundle(bundleId: number){
    return this.http.delete<void>(`${environment.apiHost}author/bundles/${bundleId}`);
  }
  
  getAllWithoutTours(): Observable<PagedResults<Bundle>> {
    return this.http.get<PagedResults<Bundle>>(environment.apiHost + 'tourist/bundles');
  }

  getById(bundleId: number): Observable<Bundle> {
    return this.http.get<Bundle>(environment.apiHost + 'tourist/bundles/' + bundleId);
  }

  addPaymentRecord(record: PaymentRecord): Observable<PaymentRecord>{
    return this.http.post<PaymentRecord>(environment.apiHost + 'shopping/paymentRecord', record)
  }
}
