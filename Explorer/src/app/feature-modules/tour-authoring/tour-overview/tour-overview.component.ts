import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { TourOverview } from '../model/touroverview.model';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { TourOverviewDetailsComponent } from '../tour-overview-details/tour-overview-details.component';
import { MapService } from 'src/app/shared/map/map.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../../payments/cart-overview.service';
import { OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecution } from '../model/tour-execution.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PositionSimulator } from '../model/position-simulator.model';
import { ProblemComponent } from '../../marketplace/problem/problem.component';


@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent implements OnInit {
  tours: TourOverview[] = [];
  tourExecution: TourExecution = {} as TourExecution;
  currentPage: 0;
  tourExecutions: Map<number, TourExecution> = new Map();
  pageSize: 0;
  readonly dialog = inject(MatDialog);
  activeTourId: number | null = null;
  isActive: boolean = false;
  position: PositionSimulator | null = null;
  shouldDisplayKeypoint: boolean = false;
  selectedTour: TourOverview;

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
    private tourExecutionService: TourExecutionService,
  private authService: AuthService) {}


  tourTagMap: { [key: number]: string } = {
    0: 'Cycling',
    1: 'Culture',
    2: 'Adventure',
    3: 'FamilyFriendly',
    4: 'Nature',
    5: 'CityTour',
    6: 'Historical',
    7: 'Relaxation',
    8: 'Wildlife',
    9: 'NightTour',
    10: 'Beach',
    11: 'Mountains',
    12: 'Photography',
    13: 'Guided',
    14: 'SelfGuided'
  };

  ngOnInit(): void {

    this.orderItem = {
      id: 0, // optional, can be undefined
      tourName: '', // provide a default string or an actual value
      price: 0,
      tourId: 0,
      cartId: 0
    };

    

    
  
   
   /* if(this.tourExecutions.get(3)?.status === null &&!this.isActive)
      alert("uslo");*/

    this.authService.user$.subscribe(user => {
      this.user = user;
       console.log(user);
      
      if (user) {
        this.tourExecutionService.getPositionByTourist(user.id).subscribe({
            next: (position: PositionSimulator) => {
                console.log('Position retrieved:', position);
                this.position = position;
            },
            error: (err) => {
                console.error('Error retrieving position:', err);
            }
        });
    }
      
      this.cartService.getCartsByUser(this.user.id).subscribe({
        next: (result: ShoppingCart[]) => {
          if(result[0])
           { this.shoppingCart = result[0];
           
          
             }  else
            this.createNewCart(this.user.id);
        }
      });
      
     
      
     
    });
    

    
    this.loadTours();
    
  }
  
  updateTours(tours: TourOverview[]): void {
    this.tours = tours;
  }

  closeMapForTour() {
    this.shouldDisplayKeypoint= false; // Postavljamo na false kada zatvorimo mapu
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
  
  showKeypoint(tour: TourOverview): void{

    this.selectedTour = tour;
    this.shouldDisplayKeypoint = true;

  }
  loadTours(): void {
    this.tourOverviewService.getAllWithoutReviews().subscribe({
      next: (data: PagedResults<TourOverview>) => {
        console.log('Tours loaded:', data);
        this.tours = data.results;
        this.loadTourExecutions();
        
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

  startTour(tourId: number): void {
    if (!this.position) {
        console.error('Position is null. Cannot start tour without a position.');
        return;
    }

    // Ensure tourExecution is initialized with all required properties
    this.tourExecution = {
        locationId: this.position.id,
        tourId: tourId,
        status: 0,
        lastActivity: new Date(),
        touristId: this.user?.id || 0, // Default to 0 if user ID is null
        completedKeys: [] // Ensure this is sent as an empty array
    };

    this.tourExecutionService.startTourExecution(this.tourExecution).subscribe({
        next: (data: TourExecution) => {
            console.log('Tour execution started:', data);
            this.isActive = true;
            this.loadTourExecutions();
        },
        error: (err) => {
            console.error('Error creating execution:', err);
        }
    });
}

  completeTourExecution(tourExecutionId?: number)
  {
    
    if(tourExecutionId !== null && tourExecutionId !== undefined)
    {
      this.tourExecutionService.completeTourExecution(tourExecutionId).subscribe({ 
        next: (data: TourExecution) => {
            console.log('Tour execution started:', data);
            this.isActive = false;
            this.loadTourExecutions()
        },
        error: (err) => {
            console.error('Error creating execution:', err);
        }
    });
    }
    
  }

  abandonTourExecution(tourExecutionId?: number)
  {
    if(tourExecutionId !== null && tourExecutionId !== undefined)
      {
    this.tourExecutionService.abandonTourExecution(tourExecutionId).subscribe({  
      next: (data: TourExecution) => {
          this.isActive = false;
          this.loadTourExecutions();
      },
      error: (err) => {
          console.error('Error creating execution:', err);
      }
  });
}
  }

  openReviews(tourId: number): void {
    this.dialog.open(TourOverviewDetailsComponent, {
      data: {
        tourId: tourId
      },
    });
  }
  
  reportProblem(tourId: number): void {
    this.dialog.open(ProblemComponent, {
      width: '40%',
      data : {
        tourId: tourId
      }
    });
    
  }

  loadTourExecutions(): void {
    if (this.user) {
        this.tours.forEach((tour) => {
            this.tourExecutionService.getTourExecutionByTourAndTourist(this.user!.id, tour.tourId).subscribe({
              next: (execution: TourExecution | null) => {
                if (execution) {
                  
                    this.tourExecutions.set(tour.tourId, execution);
                 /*  console.log("execution");
                    console.log(execution);
                    console.log(this.tourExecutions.get(1)?.lastActivity);*/
                    
                    if(execution.status === 0)
                      this.isActive = true;
                } else {
                
                }
            },
                error: (err) => {
                    console.error(`Error loading execution for tour ${tour.tourId}:`, err);
                }
            });
        });
    }
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

  getTagNumber(word: string): number { //daj broj od tada
    for (const [key, value] of Object.entries(this.tourTagMap)) {
      if (value === word) {
        return +key; // Convert the key back to a number
      }
    }
    return -1; // Return -1 or any default value if the word is not found
  }
  
}