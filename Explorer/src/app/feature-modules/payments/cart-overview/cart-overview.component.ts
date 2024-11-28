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
     private purchaseService: PurchaseService) {} 

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
        this.cartItems = result;
        this.currentCart.items = result;
  
        // Kreiraj niz Promisa za dohvat tura
        const tourRequests = this.cartItems.map((item) =>
          this.purchaseService.getTour(item.tourId).toPromise().then(
            (tour: Tour | undefined) => {
              if (tour) {
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
               
                this.purchaseToken = {
                  userId: this.user.id,
                  cartId: this.currentCart.id,
                  tourId: item.tourId,
                  price: item.price,
                  purchaseDate: new Date()
                 
                 
                }

                this.cartService.createToken(this.purchaseToken).subscribe({
                  next: (result: TourPurchaseToken) => {
                  //  alert("Created token!");
                  this.loadUserWallet(this.userId || -1);
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
