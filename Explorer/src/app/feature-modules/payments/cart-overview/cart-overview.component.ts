import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart-overview.service';
import { ActivatedRoute } from '@angular/router';
import { OrderItem } from '../model/order-item.model';
import { Subscription } from 'rxjs';
import { PersonInfoService } from '../../person.info/person.info.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PersonInfo } from '../../person.info/model/info.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { environment } from 'src/env/environment';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PurchaseService } from '../../tour-authoring/tour-purchase-token.service';
import { TourTags } from '../../tour-authoring/model/tour.tags.model';
import Swal from 'sweetalert2';
import { TourPurchaseToken } from '../model/tour-purchase-token.model';
import { Notification } from '../../administration/model/notifications.model';
import { PaymentsService } from '../payments.service';
import { Bundle } from '../../tour-authoring/model/budle.model';
import { PaymentRecord } from '../model/payment-record.model';
import { TourOverviewService } from '../../tour-authoring/tour-overview.service';
import { TourOverview } from '../../tour-authoring/model/touroverview.model';

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
  paymentRecord: PaymentRecord = {} as PaymentRecord;
  toursByOrderItem: { [key: number]: TourOverview[] } = {};


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
     private purchaseService: PurchaseService,
     private paymentService: PaymentsService,
     private tourService: TourOverviewService,
    ) {} 

  ngOnInit(): void {
   
    this.cartId = this.route.snapshot.params['cartId'];
   
    this.userSubscription = this.authService.getUser().subscribe((user: User) => {
      this.userId = user.id; 
      this.loadUserWallet(this.userId);
      this.loadCurrentCart(this.userId);
      
     
    });
    
    
  }

  private loadToursForBundle(order: OrderItem): void {
    this.paymentService.getById(order.tourId).subscribe({
      next: (bundle: Bundle) => {
        const tourRequests = bundle.tourIds.map(tourId =>
          this.tourService.getById(tourId).toPromise()
        );

        // Kad se svi zahtevi za ture završe, čuvaj rezultat u kešu
        Promise.all(tourRequests).then(tours => {
          // Filtriraj undefined vrednosti
          this.toursByOrderItem[order.tourId!] = tours.filter(
            (tour): tour is TourOverview => tour !== undefined
          );
        });
        console.log(this.toursByOrderItem);
      },
      error: err => {
        console.error('Error loading bundle:', err);
      }
    });
  }

  getCachedTours(orderId: number): TourOverview[] {
    return this.toursByOrderItem[orderId] || [];
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
        this.cartItems = result;
        this.currentCart.items = result;

        this.cartItems.forEach(order => {
          if (order.isBundle) {
            console.log('poziva se')
            this.loadToursForBundle(order);
          }
        });
  
        // Kreiraj niz Promisa za dohvat tura
        
        const tourRequests = this.cartItems.map((item) =>
          this.purchaseService.getTour(item.tourId).toPromise().then(
            (tour: Tour | undefined) => {
              if(tour) {
                item.tourDetails = tour;
              } else {
                console.warn(`Tura sa ID ${item.tourId} nije pronađena.`);
              }
            },
            (err) => {
              console.error(`Greška pri dohvaćanju ture za stavku sa ID ${item.tourId}:`, err);
            }
          )
        );
  
        // Sačekaj sve Promise-e pre nego što preračunaš ukupnu cenu
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
  

  checkout(): void {
    if (this.totalPrice > this.wallet) {
      console.error("Nedovoljno sredstava u wallet-u.");
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
              next: (result: PersonInfo) => {

                
               
              this.cartItems = []; 
              this.currentCart.items.forEach(item => {

                //Ako je stavka bundle
                if(item.isBundle === true){

                  this.paymentService.getById(item.tourId).subscribe({
                    next: (bundle: Bundle) => {
                      console.log(bundle);
                      //kreiraj payment record
                      this.paymentRecord.bundleId = bundle.id;
                      this.paymentRecord.touristId = this.user.id;
                      this.paymentRecord.price = bundle.price;
                      this.paymentRecord.date = new Date();
                      console.log(this.paymentRecord)
                      this.paymentService.addPaymentRecord(this.paymentRecord).subscribe({
                        next: (result: PaymentRecord) => {
                         console.log("Payment record succesuly created.", result)      
                        },
                        error: (err: any) => {
                          console.log("Error creating payment token.", err)      
                        }
                      });


                      //za svaki tour id u bundlu
                      bundle.tourIds.forEach(tourId => {
                        this.purchaseToken = {
                          userId: this.user.id,
                          cartId: this.currentCart.id,
                          tourId: tourId,
                          price: 0,
                          purchaseDate: new Date()    
                        }
                      //kreiraj token
                        this.cartService.createToken(this.purchaseToken).subscribe({
                          next: (result: TourPurchaseToken) => {
                            Swal.fire('Success', 'Created token!', 'success');
        
                          },
                          error: (err: any) => {
                            Swal.fire('Error', 'Error creating token', 'error');
        
                          }
                        });
                      }
                      );
                    },
                    error: (err: any) => {
                      console.log('Error loading bundle');  
                    }
                  });
                  

                //ako je stavka tura
                } else {
                  this.purchaseToken = {
                    userId: this.user.id,
                    cartId: this.currentCart.id,
                    tourId: item.tourId,
                    price: item.price,
                    purchaseDate: new Date()    
                  }
                  this.cartService.createToken(this.purchaseToken).subscribe({
                    next: (result: TourPurchaseToken) => {
                      Swal.fire('Success', 'Created token!', 'success');
  
                    },
                    error: (err: any) => {
                      Swal.fire('Error', 'Error creating token', 'error');
  
                    }
                  });                

                }
                this.cartService.removeFromCart(item.id || -1).subscribe({
                  next: () => {
                  
                   
                  },
                  error: (err: any) => {
                    Swal.fire('Error', 'Error removing item', 'error');

                  }
                });
              });
              this.totalPrice = 0; // Resetujte ukupnu cenu
              
              
            //  alert("Korpa uspešno očišćena.");

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
  getTagName(tagId: number): string {
    return TourTags[tagId];
  }

  
}
