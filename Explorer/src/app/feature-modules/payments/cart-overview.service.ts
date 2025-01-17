import { Injectable } from '@angular/core';
import { Tour } from '../tour-authoring/model/tour.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from 'src/env/environment';
import { TourPurchaseToken } from './model/tour-purchase-token.model';
import { ShoppingCart } from './model/shopping-cart.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Notification } from '../administration/model/notifications.model';
import { OrderItem } from './model/order-item.model';

@Injectable({
  providedIn: 'root' 
})
export class CartService {
  private cartItems: any[] = []; 
  private tours: Tour[] = [];

  //pracenje broja artikala i preview 
  private cartItemCount = new BehaviorSubject<number>(0); 
  cartItemCount$ = this.cartItemCount.asObservable(); 
  private cartItemsSubject = new BehaviorSubject<OrderItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}
  
  setTours(tours: Tour[]): void {
    this.tours = tours;
  }

  addToCart(item: OrderItem): Observable<OrderItem> {
    //this.cartItems.push(item);
    return this.http.post<OrderItem>(environment.apiHost + 'shopping/item', item)
    .pipe(
      tap(() => {
        this.updateCartItemCount(1); // Povećavamo broj artikala
        this.getCartItems(item.cartId).subscribe(); // Automatski osveži korpu
      })
    );


  }

  createToken(token: TourPurchaseToken): Observable<TourPurchaseToken>{
    return this.http.post<TourPurchaseToken>(environment.apiHost + 'shopping/token', token);
  }


  removeFromCart(itemId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + 'shopping/item/' + itemId)
    .pipe(
      tap(() => {
        this.updateCartItemCount(-1); // Smanjujemo broj artikala
      })
    );
  }

  getCartItems(cartId: number): Observable<OrderItem[]> {
    //return this.cartItems;
    return this.http.get<OrderItem[]>(environment.apiHost + 'shopping/item/getAllFromCart/' + cartId)
    .pipe(
      tap((items) => {
        this.cartItemCount.next(items.length); // Postavljamo inicijalni broj artikala
        this.updateCartItems(items);
      })
    );
  }

  private updateCartItemCount(change: number): void {
    const currentCount = this.cartItemCount.value;
    this.cartItemCount.next(currentCount + change);
  }

  private updateCartItems(items: OrderItem[]): void {
    this.cartItemsSubject.next(items);
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


  applyCoupon(cartId: number, promoCode: string): Observable<ShoppingCart> {
    // Koristimo HttpParams za dodavanje query parametara
    const url = `${environment.apiHost}shopping/applyCoupon/${cartId}`;
    return this.http.put<ShoppingCart>(url, null, {
      params: { promoCode }, // Query param
    });

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
