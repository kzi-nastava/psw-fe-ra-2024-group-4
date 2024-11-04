import { Injectable } from '@angular/core';
import { Tour } from './model/tour.model';

@Injectable({
  providedIn: 'root' 
})
export class CartService {
  private cartItems: any[] = []; 
  private tours: Tour[] = [];

  constructor() {}
  
  setTours(tours: Tour[]): void {
    this.tours = tours;
  }

  addToCart(item: any): void {
    this.cartItems.push(item);
  }


  removeFromCart(item: any): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
  
  getTourById(tourId: number): Tour | undefined {
    return this.tours.find(tour => tour.id === tourId);
  }
}
