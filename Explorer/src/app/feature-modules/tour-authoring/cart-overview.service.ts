import { Injectable } from '@angular/core';
import { Tour } from './model/tour.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from './model/order-item.model';
import { environment } from 'src/env/environment';
import { TourPurchaseToken } from './model/tour-purchase-token.model';
import { ShoppingCart } from './model/shopping-cart.model';

@Injectable({
  providedIn: 'root' 
})
export class CartService {
  private cartItems: any[] = []; 
  private tours: Tour[] = [];

  constructor(private http: HttpClient) {}
  
  setTours(tours: Tour[]): void {
    this.tours = tours;
  }

  addToCart(item: OrderItem): Observable<OrderItem> {
    //this.cartItems.push(item);
    return this.http.post<OrderItem>(environment.apiHost + 'shopping/item', item);


  }

  createToken(token: TourPurchaseToken): Observable<TourPurchaseToken>{
    return this.http.post<TourPurchaseToken>(environment.apiHost + 'shopping/token', token);
  }


  removeFromCart(itemId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + 'shopping/item/' + itemId);
  }

  getCartItems(cartId: number): Observable<OrderItem[]> {
    //return this.cartItems;
    return this.http.get<OrderItem[]>(environment.apiHost + 'shopping/item/getAllFromCart/' + cartId);
  }

  createShoppingCart(cart: ShoppingCart): Observable<ShoppingCart>{
    return this.http.post<ShoppingCart>(environment.apiHost + 'shopping', cart);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
  
  getTourById(tourId: number): Tour | undefined {
    return this.tours.find(tour => tour.id === tourId);
  }

  deleteCart(cartId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + 'shopping/' + cartId);
  }

  getCartsByUser(userId: number): Observable<ShoppingCart[]>
  {
    return this.http.get<ShoppingCart[]>(environment.apiHost + 'shopping/getByUser/' + userId);
  }
}
