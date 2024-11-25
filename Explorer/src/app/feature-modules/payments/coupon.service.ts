import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from './model/coupon.model';
import { environment } from 'src/env/environment';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpClient) { }

  addCoupon(coupon: Coupon):Observable<Coupon>{
    return this.http.post<Coupon>(environment.apiHost+'author/coupon',coupon);
  }
  getAll(authorId: number): Observable<PagedResults<Coupon>>{
    return this.http.get<PagedResults<Coupon>>(environment.apiHost+'author/coupon/'+ authorId);
  }
  getByTourId(id: number): Observable<Coupon>{
    return this.http.get<Coupon>(environment.apiHost+'author/coupon/tour/'+ id);
  }
  update(coupon:Coupon):Observable<Coupon>{
    return this.http.put<Coupon>(environment.apiHost+'author/coupon/'+coupon.id,coupon);
  }
  delete(couponId: number):Observable<Coupon>{
      return this.http.delete<Coupon>(environment.apiHost+'author/coupon/'+couponId);
  }
}
