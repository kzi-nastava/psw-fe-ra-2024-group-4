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
import { OrderItem } from '../../payments/model/order-item.model';
import { ShoppingCart } from '../../payments/model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecution } from '../model/tour-execution.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PositionSimulator } from '../model/position-simulator.model';
import { Tour } from '../model/tour.model';
import { PurchaseService } from '../tour-purchase-token.service';
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
  totalPrice: number = 0;

  isCartPreviewVisible = false;

  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable(); 

  orderItem: OrderItem;
  shoppingCart: ShoppingCart;
  user: User;
  userPurchases: ShoppingCart[];
  
  speaker: SpeechSynthesisUtterance;

  constructor(private tourOverviewService: TourOverviewService, 
    private mapService: MapService, 
    private router: Router,
    private cartService: CartService,
    private tourExecutionService: TourExecutionService,
    private purchaseService: PurchaseService,
  private authService: AuthService) {
    this.speaker = new SpeechSynthesisUtterance();
    this.speaker.lang = 'en-US';
  }


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
            this.calculateTotalPrice();
            this.loadCartItemDetails();
          
             }  else
            this.createNewCart(this.user.id);
        }
      });
      
     
      
     
    });
    

    
    this.loadTours();
    
  }
  
  playTourAudio(text: string): void
  {
    this.speaker.text = text;
    window.speechSynthesis.speak(this.speaker);
  }
  calculateTotalPrice(): void {
    this.totalPrice = 0;
    if (this.shoppingCart && this.shoppingCart.items) {
        this.shoppingCart.items.forEach(item => {
            this.totalPrice += item.price || 0; // Osiguranje da cena ne bude NaN
        });
    }
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

    this.orderItem.cartId = this.shoppingCart.id || -1;
    this.orderItem.tourName = tour.tourName;
    this.orderItem.price = tour.price || 0.0;
    this.orderItem.tourId = tour.tourId;


   
          this.cartService.addToCart(this.orderItem).subscribe({
            next: (result: OrderItem) => {
              alert("Item successfully added.");
              this.calculateTotalPrice();
            },
            error: (err:any) => alert("Error adding item.")
          });
        
        
      

    const currentCount = this.cartItemCount.value;
    this.cartItemCount.next(currentCount + 1);
   
   
  }

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
  showCartPreview(): void {
    this.isCartPreviewVisible = true;
  }

  hideCartPreview(): void {
    this.isCartPreviewVisible = false;
  }

  loadCartItemDetails(): void {
    if (this.shoppingCart && this.shoppingCart.items) {
      this.shoppingCart.items.forEach((item) => {
        this.purchaseService.getTour(item.tourId).subscribe({
          next: (tour) => {
            item.tourDetails = tour; // Dodavanje detalja ture
          },
          error: (err) => {
            console.error(`Error loading tour details for item ${item.tourId}:`, err);
          }
        });
      });
    }
  }
  
}