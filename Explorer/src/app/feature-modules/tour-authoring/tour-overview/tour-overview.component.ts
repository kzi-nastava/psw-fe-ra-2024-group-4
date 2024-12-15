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
import { ShoppingCart } from '../../payments/model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecution } from '../model/tour-execution.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PositionSimulator } from '../model/position-simulator.model';
import { Tour } from '../model/tour.model';
import { PurchaseService } from '../tour-purchase-token.service';
import { ProblemComponent } from '../../marketplace/problem/problem.component';
import Swal from 'sweetalert2';
import { PaymentsService } from '../../payments/payments.service';
import { OrderItem } from '../../payments/model/order-item.model';
import { Bundle } from '../model/budle.model';
import { SalesService } from '../../payments/sales.service';
import { TourPurchaseToken } from '../../payments/model/tour-purchase-token.model';



@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent implements OnInit {
  tours: TourOverview[] = [];
  bundles:Bundle[] = [];
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

  //pracenje broja artikala i preview
  cartItemCount: number = 0; 
  cartItems: OrderItem[] = [];

  orderItem: OrderItem;
  shoppingCart: ShoppingCart;
  user: User;
  userPurchases: ShoppingCart[];

  
  speaker: SpeechSynthesisUtterance;

  selectedTabIndex: number = 0;



  constructor(private tourOverviewService: TourOverviewService, 
    private mapService: MapService, 
    private router: Router,
    private cartService: CartService,
    private tourExecutionService: TourExecutionService,
    private purchaseService: PurchaseService,
    private paymentService: PaymentsService,
    private overviewService: TourOverviewService,
    private salesService: SalesService,
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
      cartId: 0,
      isBundle: false
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
    

    this.cartService.cartItemCount$.subscribe((count) => {
      this.cartItemCount = count;
    });

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });

    // Učitavanje stanja korpe pri pokretanju
    this.cartService.getCartItems(this.user.id).subscribe();
  

    this.loadTours();
    this.loadBundles();
    
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
        error: (err: any) => Swal.fire({
          title: 'Error!',
          text: 'Error creating cart.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        })
      } );
  }
  
  showKeypoint(tour: TourOverview): void{

    this.selectedTour = tour;
    this.shouldDisplayKeypoint = true;

  }
  loadTours(): void {
    // Prvo dohvatite kupljene ture korisnika
    if (this.user) {
      this.purchaseService.getUserPurchasedTours(this.user.id).subscribe({
        next: (purchasedTokens: TourPurchaseToken[]) => {
          const purchasedTourIds = purchasedTokens.map(token => token.tourId);
  
          // Dohvatite sve ture
          this.tourOverviewService.getAllWithoutReviews().subscribe({
            next: (data: PagedResults<TourOverview>) => {
              console.log('Tours loaded:', data);
  
              // Filtrirajte ture koje korisnik nije kupio
              this.tours = data.results.filter(tour => !purchasedTourIds.includes(tour.tourId));
              
              this.applyDiscounts();
              this.loadTourExecutions();
            },
            error: (err) => {
              console.error('Error loading tours:', err);
            }
          });
        },
        error: (err) => {
          console.error('Error fetching purchased tours:', err);
        }
      });
    } else {
      console.error('User not logged in. Cannot load tours.');
    }
  }
  
  // loadTours(): void {
  //   this.tourOverviewService.getAllWithoutReviews().subscribe({
  //     next: (data: PagedResults<TourOverview>) => {
  //       console.log('Tours loaded:', data);
  //       this.tours = data.results;
  //       this.applyDiscounts();
  //       this.loadTourExecutions();
        
  //     },
  //     error: (err) => {
  //       console.error('Error loading tours:', err);
  //     }
  //   });
  // }

  applyDiscounts(): void { 
    const currentDate = new Date();

    this.salesService.getSalesForTourist().subscribe((sales) => {
        this.tours.forEach((tour) => {
            const applicableSale = sales.find((sale) =>
                sale.tourIds.includes(tour.tourId) &&
                new Date(sale.startDate) <= currentDate &&
                new Date(sale.endDate) >= currentDate
            );

            if (applicableSale) {
                // Primeni popust
                tour.originalPrice = tour.price ?? 0;
                tour.price = this.calculateDiscountedPrice(
                    tour.price ?? 0,
                    applicableSale.discountPercentage
                );
            }
        });
    });
}

calculateDiscountedPrice(price: number, discountPercentage: number): number {
    return price - (price * discountPercentage) / 100;
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
    const existingItem = this.shoppingCart.items.find(item => item.tourId === tour.tourId);

    if (existingItem) {
      Swal.fire({
        title: 'Already in Cart!',
        text: 'This tour is already in your cart.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return; // Prekini izvršavanje funkcije ako je tura već u korpi
    }

    this.orderItem.cartId = this.shoppingCart.id || -1;
    this.orderItem.tourName = tour.tourName;
    this.orderItem.price = tour.discountedPrice !== undefined ? tour.discountedPrice : tour.price || 0; //tour.price || 0.0;
    this.orderItem.tourId = tour.tourId;

  this.shoppingCart.items.push(this.orderItem);
  this.cartItemCount = this.shoppingCart.items.length;
   
          this.cartService.addToCart(this.orderItem).subscribe({
            next: (result: OrderItem) => {
              Swal.fire({
                title: 'Success!',
                text: 'Item successfully added.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.calculateTotalPrice();
            },
            error: (err:any) => Swal.fire({
              title: 'Error!',
              text: 'Error adding item.',
              icon: 'error',
              confirmButtonText: 'Try Again'
            })
          });
   
   
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


  //BUNDLES
  
  loadBundles(): void{
    this.paymentService.getAllWithoutTours().subscribe({
      next: (data: PagedResults<Bundle>) => {
        this.bundles = data.results.filter(bundle => bundle.status === 1);
        this.loadToursForBundle();
        
      },
      error: (err) => {
        console.error('Error loading bundles:', err);
      }
    });
  }

  loadToursForBundle(): void {
    for (const bundle of this.bundles) {
      bundle.tours = [];

      for (const tourId of bundle.tourIds) {
        try {
          this.overviewService.getById(tourId).subscribe({
            next: (data: TourOverview) => {
              console.log(data);
              bundle.tours.push(data);
              
            },
            error: (err) => {
              console.error('Error tour:', err);
            }
          });
        } catch (error) {
          console.error(`Failed to load tour with ID ${tourId}`, error);
        }
      }
    }
  }

  addBundleToCart(bundle: Bundle) {
    if(bundle.id === undefined){
      return;
    }
    this.orderItem.cartId = this.shoppingCart.id || -1;
    this.orderItem.tourName = bundle.name;
    this.orderItem.price = bundle.price || 0.0;
    this.orderItem.tourId = bundle.id;
    this.orderItem.isBundle = true;

    console.log(this.orderItem);


   
          this.cartService.addToCart(this.orderItem).subscribe({
            next: (result: OrderItem) => {
              Swal.fire({
                title: 'Success!',
                text: 'Item successfully added.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.calculateTotalPrice();
            },
            error: (err:any) => Swal.fire({
              title: 'Error!',
              text: 'Error adding item.',
              icon: 'error',
              confirmButtonText: 'Try Again'
            })
          });
        
        
      

    // const currentCount = this.cartItemCount.value;
    // this.cartItemCount.next(currentCount + 1);
  }

  
}