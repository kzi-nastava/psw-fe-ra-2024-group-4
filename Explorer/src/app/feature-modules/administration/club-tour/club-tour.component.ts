import { Component, Input } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ClubTour } from '../model/club-tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourOverviewService } from '../../tour-authoring/tour-overview.service';
import { environment } from 'src/env/environment';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCart } from '../../payments/model/shopping-cart.model';
import { CartService } from '../../payments/cart-overview.service';
import { OrderItem } from '../../payments/model/order-item.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; 

@Component({
  selector: 'xp-club-tour',
  templateUrl: './club-tour.component.html',
  styleUrls: ['./club-tour.component.css']
})
export class ClubTourComponent {
  
  @Input() clubId!: number;
  @Input() ownerId!: number;
  isOwner: boolean = false;
  user: User | null = null;
  clubTours: ClubTour[] = [];

  shoppingCart: ShoppingCart;
  totalPrice: number = 0;
  cartItemCount = new BehaviorSubject<number>(0); 
  cartItemCount$ = this.cartItemCount.asObservable();


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



  //constructor(private service: AdministrationService, private authService: AuthService, private tourOverviewService: TourOverviewService){}

  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private tourOverviewService: TourOverviewService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(){
    console.log(this.clubId);
    this.getUser();
    this.getClubTours();

    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (user) {
        this.getOrCreateCart(user.id);
      }
    });
  }

  getImage(image: string): string {
      return environment.webroot + "images/clubs/" + image;
    }

  
  getUser(): void{
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      //console.log('PROVERA');
      console.log(user);
      //this.userId = user.id;
      if(user.id === this.ownerId){
        this.isOwner = true;
      }
    });
  }

  getClubTours(): void{
    this.service.getAllClubTours().subscribe({
      next: (result: PagedResults<ClubTour>) =>{
        this.clubTours = result.results.filter(clubTour => clubTour.clubId === this.clubId);
        this.getToursInfo();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  getToursInfo(): void{
    this.clubTours.forEach((clubTour) => {
      if (clubTour.tourId) {
        this.tourOverviewService.getById(clubTour.tourId).subscribe({
          next: (tour) => {
            clubTour.title = tour.tourName;
            clubTour.description = tour.tourDescription;
            clubTour.price = tour.price;
            clubTour.difficulty = tour.tourDifficulty;
            clubTour.tags = tour.tags;
            console.log('DIFFFF',clubTour.difficulty);
           // clubTour.lengthInKm = 
          },
          error: (err) => {
           // console.error(Error fetching tour details for tourId: ${clubTour.tourId}, err);
          }
        });
      } else {
        //console.warn(ClubTour with missing tourId:, clubTour);
      }
    });
  }
  getTagNumber(word: string): number { //daj broj od tada
    for (const [key, value] of Object.entries(this.tourTagMap)) {
      if (value === word) {
        return +key; // Convert the key back to a number
      }
    }
    return -1; // Return -1 or any default value if the word is not found
  }




  getOrCreateCart(userId: number): void {
    this.cartService.getCartsByUser(userId).subscribe({
      next: (result: ShoppingCart[]) => {
        if (result[0]) {
          this.shoppingCart = result[0];
          this.calculateTotalPrice();
        } else {
          this.createNewCart(userId);
        }
      }
    });
  }

  createNewCart(userId: number): void {
    this.shoppingCart = {
      userId: userId,
      items: [],
      purchaseTokens: [],
      totalPrice: 0
    };
    this.cartService.createShoppingCart(this.shoppingCart).subscribe({
      next: (result: ShoppingCart) => {
        this.shoppingCart = result;
      },
      error: () => alert('Error creating cart.')
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.shoppingCart.items.reduce(
      (acc, item) => acc + (item.price || 0),
      0
    );
  }
  addToCart(clubTour: ClubTour): void {
    if (!this.shoppingCart) {
      // Ako korpa nije inicijalizovana, kreiraj je
      this.getOrCreateCart(this.user?.id || -1);
      return; // Sačekaj da se korpa inicijalizuje
    }
  
    const discountedPrice = clubTour.price && clubTour.discount 
    ? clubTour.price - (clubTour.price * (clubTour.discount / 100))
    : clubTour.price || 0;

    const orderItem: OrderItem = {
      cartId: this.shoppingCart.id || -1,
      tourName: clubTour.title || '',
      price: discountedPrice,
      tourId: clubTour.tourId || -1,
      isBundle: false
    };
  
    this.cartService.addToCart(orderItem).subscribe({
      next: () => {
       // alert('Club Tour successfully added to cart.');
        this.calculateTotalPrice();
        const currentCount = this.cartItemCount.value;
        this.cartItemCount.next(currentCount + 1);
        Swal.fire({
          title: 'Tour successfully purchased and added to cart!',
          text: 'What would you like to do next?',
         
          showCancelButton: true,
          confirmButtonText: 'Go to Cart',
          cancelButtonText: 'Go Back to Club',
          reverseButtons: true,
          customClass: {
            popup: 'swal-popup',
           
          },  willOpen: () => {
            // Dinamički postavljanje slike kao pozadinu pomoću stilova
            const imageUrl = this.getImage('plane.gif'); // Dinamički uzmi sliku
            document.querySelector('.swal-popup')!.setAttribute(
              'style',
              `background-image: url(${imageUrl}); background-size: cover; background-position: center;`
            );
          }
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigacija do korpe
            this.router.navigate([`/cart`, this.shoppingCart.id]);
          } 
          // Ako je 'Cancel', ne radi ništa, samo zatvori modal
        });

      },
      error: () => alert('Error adding Club Tour to cart.')
    });
  }
  


}

