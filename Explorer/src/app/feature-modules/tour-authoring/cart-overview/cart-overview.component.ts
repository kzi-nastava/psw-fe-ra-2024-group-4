import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart-overview.service';

@Component({
  selector: 'app-cart-overview',
  templateUrl: './cart-overview.component.html',
  styleUrls: ['./cart-overview.component.css']
})
export class CartOverviewComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {} 

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems(); 
    this.calculateTotalPrice(); 
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      const tour = this.cartService.getTourById(item.tourId);
      console.log('Tour:', tour); 
      return total + (tour ? tour.price : 0);
    }, 0);
  }

  checkout(): void {

    console.log('Proceeding to checkout');
  }
}
