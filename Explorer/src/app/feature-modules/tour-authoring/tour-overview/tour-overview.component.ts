import { Component, inject, OnInit } from '@angular/core';
import { TourOverview } from '../model/touroverview.model';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { TourOverviewDetailsComponent } from '../tour-overview-details/tour-overview-details.component';
import { KeyPoint } from '../model/keypoint.model';
import { MapService } from 'src/app/shared/map/map.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../cart-overview.service';
import { OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent implements OnInit {
  tours: TourOverview[] = [];
  currentPage: 0;
  pageSize: 0;
  readonly dialog = inject(MatDialog);

  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable(); 

  orderItem: OrderItem;
  shoppingCart: ShoppingCart;
  user: User;
  userPurchases: ShoppingCart[];


  constructor(private tourOverviewService: TourOverviewService, 
    private mapService: MapService, 
    private router: Router,
    private cartService: CartService,
  private authService: AuthService) {}

  ngOnInit(): void {

    this.orderItem = {
      id: 0, // optional, can be undefined
      tourName: '', // provide a default string or an actual value
      price: 0,
      tourId: 0,
      cartId: 0
    };

    this.authService.user$.subscribe(user => {
      this.user = user;
      
      this.cartService.getCartsByUser(this.user.id).subscribe({
        next: (result: ShoppingCart[]) => {
          if(result[0])
           { this.shoppingCart = result[0];
            alert(this.shoppingCart.id);
          
             }  else
            this.createNewCart(this.user.id);
        }
      })
      
     
      
     
    });
    this.loadTours();
    

   
  }

  createNewCart(userId: number): void
  {
    this.shoppingCart = {
      userId: userId, // or undefined if optional
      items: [],
      purchaseTokens: [],
      totalPrice: 0
    };

    

    

      this.cartService.createShoppingCart(this.shoppingCart).subscribe({
        next: (result: ShoppingCart) => { 
          this.shoppingCart = result;
        
        
        },
        error: (err: any) => alert("Error creating cart.")
      } );
  }
  
  loadTours(): void {
    this.tourOverviewService.getAllWithoutReviews().subscribe({
      next: (data: PagedResults<TourOverview>) => {
        console.log('Tours loaded:', data);
        this.tours = data.results;
      },
      error: (err) => {
        console.error('Error loading tours:', err);
      }
    });
  }

  // Optional: Add methods to handle pagination (e.g., next page, previous page)
  nextPage(): void {
    this.currentPage++;
    this.loadTours(); // Reload tours for the new page
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTours(); // Reload tours for the new page
    }
  }

  openReviews(tourId: number): void {
    this.dialog.open(TourOverviewDetailsComponent, {
      data: {
        tourId: tourId
      },
    });
  }

  addToCart(tour: TourOverview): void {
   /* this.cartService.addToCart({
      tourId : tour.tourId,
      tourName: tour.tourName, 
      price: tour.price 
    });
    const currentCount = this.cartItemCount.value;
    this.cartItemCount.next(currentCount + 1); */

    this.orderItem.cartId = this.shoppingCart.id || -1;
    this.orderItem.tourName = tour.tourName;
    this.orderItem.price = tour.price || 0.0;
    this.orderItem.tourId = tour.tourId;


   
          this.cartService.addToCart(this.orderItem).subscribe({
            next: (result: OrderItem) => {
              alert("Item successfully added.");
            },
            error: (err:any) => alert("Error adding item.")
          });
        
        
      

    const currentCount = this.cartItemCount.value;
    this.cartItemCount.next(currentCount + 1);
   
   
  }

//   addToCart(tour: TourOverview): void {
//     const fullTour = this.cartService.getTourById(tour.tourId); 
//     this.cartService.addToCart({
//         tourName: tour.tourName, 
//         price: fullTour ? fullTour.price : 0 
//     });
//     const currentCount = this.cartItemCount.value;
//     this.cartItemCount.next(currentCount + 1); 
// }

  openCart(cartId: number): void {
    this.router.navigate([`/cart/${cartId}`]);
  }
}
