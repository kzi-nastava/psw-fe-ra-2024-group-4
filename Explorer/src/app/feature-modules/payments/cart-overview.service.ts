import { Injectable } from '@angular/core';
import { Tour } from '../tour-authoring/model/tour.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from './model/order-item.model';
import { environment } from 'src/env/environment';
import { TourPurchaseToken } from './model/tour-purchase-token.model';
import { ShoppingCart } from './model/shopping-cart.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Notification } from '../administration/model/notifications.model';

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

  updateCart(cartId: number, cart: ShoppingCart): Observable<ShoppingCart>{
    return this.http.put<ShoppingCart>(environment.apiHost + 'shopping/' + cartId, cart);
  }

  

  getAllNotifications(userId: number, role: 'tourist' | 'author' | 'administrator'): Observable<PagedResults<Notification>> {
    const url = `${environment.apiHost}${role}/notification/getall/${userId}`;
    return this.http.get<PagedResults<Notification>>(url);
  }

  updateNotification(role: 'tourist' | 'author' | 'administrator', notification: Notification): Observable<any> {
    const url = `${environment.apiHost}${role}/notification/${notification.id}`;
    return this.http.put(url, notification);
  }

  createNotification(role: 'tourist' | 'author' | 'administrator', notification: Notification): Observable<Notification>
  {
    const url = `${environment.apiHost}${role}/notification/`;
    return this.http.post<Notification>(url, notification);
  }
}
