import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from './model/sales.model';
import { environment } from 'src/env/environment';
import { PurchaseService } from '../tour-authoring/tour-purchase-token.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = environment.apiHost + 'author/sales';
  private apiUrl2 = environment.apiHost + 'tourist/sales';

  constructor(private http: HttpClient, private purchaseService: PurchaseService) { }

  getSales(userId: number): Observable<Sale[]> {
    const params = new HttpParams().set('userId', userId.toString()); 
    return this.http.get<Sale[]>(this.apiUrl, { params }); 
  }

  //dobavljanje svih sale za turistu 
  getSalesForTourist(): Observable<Sale[]> { 
    return this.http.get<Sale[]>(this.apiUrl2); 
  }

  createSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, sale); 
  }

  updateSale(sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/${sale.id}`, sale); 
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); 
  }

  activateSale(sale: Sale): void {
    sale.tourIds.forEach((tourId) => {
      this.purchaseService.getTour(tourId).subscribe((tour) => {
        if (tour) {
          tour.discountedPrice = this.calculateDiscountedPrice(tour.price, sale.discountPercentage);
          
        }
      });
    });
  }

  calculateDiscountedPrice(price: number, discountPercentage: number): number {
    return price - (price * (discountPercentage / 100));
  }
}
