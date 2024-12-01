import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart-overview.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItem } from '../model/order-item.model';
import { Subscription } from 'rxjs';
import { PersonInfoService } from '../../person.info/person.info.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PersonInfo } from '../../person.info/model/info.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { PurchaseService } from '../../tour-authoring/tour-purchase-token.service';
import { TourTags } from '../../tour-authoring/model/tour.tags.model';
import Swal from 'sweetalert2';
import { Notification } from '../../administration/model/notifications.model';
import { TourPurchaseToken } from '../model/tour-purchase-token.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourService } from '../../tour-authoring/tour.service';
import { environment } from 'src/env/environment';


@Component({
  selector: 'app-cart-overview',
  templateUrl: './cart-overview.component.html',
  styleUrls: ['./cart-overview.component.css']
})
export class CartOverviewComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  cartId: number | null = null;
  wallet: number = 0;
  userId: number | null = null; 
  user: PersonInfo;
  currentCart: ShoppingCart;
  purchaseToken: TourPurchaseToken;
  promoCode: string = '';
  purchaseNotification: Notification;
  private userSubscription: Subscription | null = null;
  
  isChatOpen: boolean = false; 
  chatMessage: string = 'Welcome to your shopping cart! You can remove any items you no longer want by clicking the trash icon next to them.Once you are ready, click Checkout to complete your purchase.';  
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }
  
  constructor(private cartService: CartService,
     private route: ActivatedRoute,
     private personInfoService: PersonInfoService,
     private authService: AuthService,
     private tourService: TourService,
     private purchaseService: PurchaseService,
     private router: Router,) {} 


  ngOnInit(): void {
   
    this.cartId = this.route.snapshot.params['cartId'];
   
    this.userSubscription = this.authService.getUser().subscribe((user: User) => {
      this.userId = user.id; 
      this.loadUserWallet(this.userId);
      this.loadCurrentCart(this.userId);
     
    });
    
    
  }

  loadCurrentCart(userId: number)
  {
    this.cartService.getCartsByUser(userId).subscribe({
      next: (result: ShoppingCart[]) => {
          this.currentCart = result[0];
          this.loadCartItems();
      }
    })

  }
  loadUserWallet(userId: number): void {
    this.personInfoService.getTouristInfo(userId).subscribe((user) => {
      this.wallet = user.wallet;
      
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems(this.cartId || -1).subscribe({
      next: (result: OrderItem[]) => {
        this.cartItems = result.map(item => ({
          ...item,
          tourDetails: item.tourDetails || {}, // Osigurajte da postoji tourDetails
        }));
        this.currentCart.items = result;
        this.fetchAuthorIds();
  
        const tourRequests = this.cartItems.map(item =>
          this.purchaseService.getTour(item.tourId).toPromise().then(
            (tour: Tour | undefined) => {
              if (tour) {
                item.tourDetails = tour;
              } else {
                console.warn(`Tura sa ID ${item.tourId} nije pronađena.`);
                item.tourDetails = { tags: [] }; // Osigurajte prazne tagove ako tour nije pronađen
              }
            },
            (err) => {
              console.error(`Greška pri dohvaćanju ture za stavku sa ID ${item.tourId}:`, err);
              item.tourDetails = { tags: [] }; // Prazna vrednost ako dođe do greške
            }
          )
        );
  
        Promise.all(tourRequests).then(() => {
          this.calculateTotalPrice();
        });
      },
      error: (err) => {
        Swal.fire('Error', 'Error loading cart items.', 'error');
      },
    });
  }
  
  
  

  calculateTotalPrice(): void {
    this.totalPrice = 0;
    this.cartItems.forEach(item => {
      this.totalPrice += item.price;
    })
  }
  
  applyCoupon(): void {
    if (!this.promoCode.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Coupon',
        text: 'Please enter a valid coupon code.',
    });
        return;
    }

    
    const missingAuthorIds = this.cartItems.some(item => !item.authorId);
    if (missingAuthorIds) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Author information is missing for some items. Please try again later.',
    });
        return;
    }

    this.cartService.applyCoupon(this.cartId!, this.promoCode).subscribe({
      next: (updatedCart) => {
          let couponAppliedToAny = false;

          updatedCart.items.forEach((item: any) => {
              const originalItem = this.cartItems.find(cartItem => cartItem.tourId === item.tourId);

           
              if (originalItem && item.price < originalItem.price) {
                  couponAppliedToAny = true;
              }
          });

          if (couponAppliedToAny) {
              Swal.fire({
                  icon: 'success',
                  title: 'Coupon Applied',
                  text: 'The coupon was successfully applied!',
              });
          } else {
              Swal.fire({
                  icon: 'info',
                  title: 'Coupon Not Applied',
                  text: 'The coupon is not valid for any tours in your cart.',
              });
          }

          // Ažurirajte stavke u korpi
          this.cartItems = updatedCart.items;
      
          this.refreshTourDetails();

          this.calculateTotalPrice();
        },
      error: (err) => {
          Swal.fire({
              icon: 'error',
              title: 'Coupon Error',
              text: 'Failed to apply coupon: ' + err.message,
          });
      },
  });
}
refreshTourDetails(): void {
  const tourRequests = this.cartItems.map((item) =>
    this.purchaseService.getTour(item.tourId).toPromise().then(
      (tour: Tour | undefined) => {
        if (tour) {
          item.tourDetails = tour;
        } else {
          console.warn(`Tour with ID ${item.tourId} not found.`);
          item.tourDetails = { tags: [], description: 'No description', difficulty: 'N/A' }; // Default values
        }
      },
      (err) => {
        console.error(`Error fetching tour details for ID ${item.tourId}:`, err);
        item.tourDetails = { tags: [], description: 'Error fetching data', difficulty: 'N/A' };
      }
    )
  );

  Promise.all(tourRequests).then(() => {
    console.log('Tour details refreshed successfully.');
  });
}
  checkout(): void {
    if (this.totalPrice > this.wallet) {
      Swal.fire({
        icon: 'error',
        title: 'Nedovoljno sredstava',
        text: 'Check your wallet.',
    });
    return;
     
    }

    if(this.cartItems.length == 0)
    {
      Swal.fire('Warning', 'The cart is empty.', 'warning');
      return;
    }

  
    if (this.userId) {
      this.personInfoService.getTouristInfo(this.userId).subscribe({
        next: (result: PersonInfo) => {
            this.user = result;
            this.user.wallet = result.wallet - this.totalPrice;
            let imagePath = environment.webroot + this.user.imageUrl;

            
            if(!this.user.imageBase64)
              this.user.imageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgEBAXE8s9QAAAAASUVORK5CYII=";
           
             
           this.personInfoService.updateTouristInfo(this.user).subscribe({
            next: () => {
                this.cartItems.forEach(item => {
                    // Koristi postojeću logiku za primenu kupona
                    let discountedPrice = item.price; // Podrazumevana cena

                    if (item.discountPercentage) { 
                        discountedPrice = item.price - (item.price * item.discountPercentage / 100);
                    }

                    this.purchaseToken = {
                        userId: this.user.id,
                        cartId: this.currentCart.id,
                        tourId: item.tourId,
                        price: discountedPrice, // Cena sa popustom
                        purchaseDate: new Date(),
                    };

                this.cartService.createToken(this.purchaseToken).subscribe({
                  next: (result: TourPurchaseToken) => {
                    Swal.fire('Success', 'Created token!', 'success');

                  },
                  error: (err: any) => {
                    Swal.fire('Error', 'Error creating token', 'error');

                  }
                });
                this.cartService.removeFromCart(item.id || -1).subscribe({
                  next: () => {
                  
                   
                  },
                  error: (err: any) => {
                    Swal.fire('Error', 'Error removing item', 'error');

                  }
                });
              });
              
              
            //  alert("Korpa uspešno očišćena.");
              this.cartItems = [];
              this.totalPrice = 0;
              this.promoCode = '';

             this.purchaseNotification = {
              description: "You successfully purchased tour/tours.",
              creationTime: new Date(),
              isRead: false,
              userId: this.user.id,
              notificationsType: 2,
              resourceId: this.currentCart.id || -1
             }

             this.cartService.createNotification('tourist', this.purchaseNotification).subscribe({
              next: (result: Notification) =>
              {
                this.router.navigate(['/purchased-tours']);

              },
              error:(err: any) =>
              {
                console.log("Error creating notification");
              }
             })
           

           
              },
              error: (err: any) =>
                 Swal.fire('Error', 'Error updating wallet', 'error')

             });
          
         
        },
        error: (err) => console.error("Greška pri učitavanju informacija o korisniku:", err)
      });
    }
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  removeCartItem(item: OrderItem): void {
    this.totalPrice -= item.price;
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
    this.cartService.removeFromCart(item.id || -1).subscribe({
      next: (result: void) => {
        Swal.fire('Success', 'Successfully removed item.', 'success');

        this.loadCartItems();
      },
      error: (err: any) => {
        Swal.fire('Error', 'Error removing item', 'error');

      }
    });
    console.log(`Tura "${item.tourName}" je uklonjena iz korpe.`);
  }
  
  async convertToImageBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }


  fetchAuthorIds(): void {
    this.cartItems.forEach((item) => {
      this.tourService.getAuthorIdByTourId(item.tourId).subscribe({
        next: (authorId) => {
          item.authorId = authorId; 
        },
        error: (err) => {
          console.error(`Error fetching authorId for tourId ${item.tourId}:`, err);
          alert("Author information is missing for some items. Please try again later.");
        },
      });
    });
  }

  getTagName(tagId: number): string {
    return TourTags[tagId];
  }


  
}
