import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart-overview.service';
import { ActivatedRoute } from '@angular/router';
import { OrderItem } from '../model/order-item.model';

@Component({
  selector: 'app-cart-overview',
  templateUrl: './cart-overview.component.html',
  styleUrls: ['./cart-overview.component.css']
})
export class CartOverviewComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  cartId: number | null = null;

  constructor(private cartService: CartService, private route: ActivatedRoute) {} 

  ngOnInit(): void {
   
    this.cartId = this.route.snapshot.params['cartId'];
    this.loadCartItems();
  }

  loadCartItems(): void {
   /* this.cartItems = this.cartService.getCartItems(); 
    this.calculateTotalPrice(); */
    this.cartService.getCartItems(this.cartId || -1).subscribe({
      next: (result: OrderItem[]) => {
        this.cartItems = result;
      },
    error: (err) => { alert("error loading items");} });
      
    
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
