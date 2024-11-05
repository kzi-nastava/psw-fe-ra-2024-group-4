import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart-overview.service';
import { ActivatedRoute } from '@angular/router';
import { OrderItem } from '../model/order-item.model';
import { Subscription } from 'rxjs';
import { PersonInfoService } from '../../person.info/person.info.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PersonInfo } from '../../person.info/model/info.model';

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
  private userSubscription: Subscription | null = null;
  
  constructor(private cartService: CartService,
     private route: ActivatedRoute,
     private personInfoService: PersonInfoService,
     private authService: AuthService ) {} 

  ngOnInit(): void {
   
    this.cartId = this.route.snapshot.params['cartId'];
    this.userSubscription = this.authService.getUser().subscribe((user: User) => {
      this.userId = user.id; 
      this.loadUserWallet(this.userId);
    });

    this.loadCartItems();
  }

  loadUserWallet(userId: number): void {
    this.personInfoService.getTouristInfo(userId).subscribe((user) => {
      this.wallet = user.wallet;
    });
  }

  loadCartItems(): void {
   /* this.cartItems = this.cartService.getCartItems(); 
    this.calculateTotalPrice(); */
    this.cartService.getCartItems(this.cartId || -1).subscribe({
      next: (result: OrderItem[]) => {
        this.cartItems = result;
        this.calculateTotalPrice();
      },
    error: (err) => { alert("error loading items");} });
      
    
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + item.price; 
    }, 0);
  }

  checkout(): void {
    if (this.totalPrice > this.wallet) {
      console.error("Nedovoljno sredstava u wallet-u.");
      return;
    }
  
    if (this.userId) {
      this.personInfoService.getTouristInfo(this.userId).subscribe({
        next: (user) => {
          const updatedUser: PersonInfo = {
            ...user, 
            wallet: user.wallet - this.totalPrice 
            
          };
          console.log(this.wallet);
          console.log('Ažuriranje korisnika:', updatedUser);   
          this.personInfoService.updateTouristInfo(updatedUser).subscribe({
            next: () => {
              console.log("Wallet uspešno ažuriran.");
              alert("");
              this.wallet = updatedUser.wallet; // Ažurirajte stanje wallet-a na frontendu
  
              // Očistite stanje korpe u aplikaciji
              this.cartItems = []; // Očistite stavke u korpi
              this.totalPrice = 0; // Resetujte ukupnu cenu
  
              console.log("Korpa uspešno očišćena.");
            },
            error: (err) => console.error("Greška pri ažuriranju wallet-a:", err)
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
    
    console.log(`Tura "${item.tourName}" je uklonjena iz korpe.`);
  }
  

}
