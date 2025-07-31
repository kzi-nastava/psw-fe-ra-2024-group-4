import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { KeypointDialogComponent } from '../keypoint-dialog/keypoint-dialog.component';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/shared/map/map.service';
import Swal from 'sweetalert2';
import { SalesService } from '../../payments/sales.service';
import { Sale } from '../../payments/model/sales.model';
import { CouponService } from '../../payments/coupon.service';
@Component({
  selector: 'xp-tours-for-author',
  templateUrl: './tours-for-author.component.html',
  styleUrls: ['./tours-for-author.component.css'],
})
export class ToursForAuthorComponent implements OnInit {
 
  tours: Tour[] = [];
  user: User | null = null;
  selectedTour: Tour;
  selectedCouponTour: Tour| undefined;
  shouldViewTour: boolean = false;
  selectedKeypoints: KeyPoint[] = [];
  private lengthUpdatedSubscription!: Subscription;
  isChatOpen: boolean = false; 
  chatMessage: string = "Manage your tours effortlessly! View all available tours, publish or archive the ones you no longer need, or click View to explore more details and set their destination.";
  
  selectedToursForDiscount: Set<number> = new Set(); 
  discount = 1;
  showSaleCheckboxes = true;
  startDate: Date | null = null;
  endDate: Date | null = null;
  dateError = false;
  tourIds: number[] = [];
  authorId: number;
  
  toggleSale() {
    this.showSaleCheckboxes = !this.showSaleCheckboxes; 
  }
  toggleTourSelection(tourId: number, isChecked: boolean) {
    if (isChecked) {
      // Ako je turu označeno, dodajte njen ID u listu
      this.tourIds.push(tourId);
    } else {
      // Ako je turu odznačeno, uklonite njen ID iz liste
      const index = this.tourIds.indexOf(tourId);
      if (index !== -1) {
        this.tourIds.splice(index, 1);
      }
    }
  }

  shouldRenderCouponForm: boolean=false;
  shouldRenderCouponView: boolean=false;
  couponMap: Map<number, boolean> = new Map();
  viewMode: boolean=false;

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
  
  constructor(private mapService: MapService, private authorService: TourAuthoringService, private service: TourService, private authService: AuthService, private router: Router, public dialog: MatDialog, private salesService: SalesService, private couponService: CouponService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);

      if(user !== null && user.role === 'author')
      {
        this.getTours(user.id);
        this.authorId=user.id;

        this.getAllCoupons(user.id);
        
      }
      
      
    });

    this.mapService.currentDistance.subscribe(distance =>
     {
      const tour = this.tours.find(t => t.id === distance.tourId);
      if (tour) {
        tour.lengthInKm = distance.distance;
      }
     }
    );
    
    
  }

  getTours(id: number): void {
    
    this.service.getToursForAuthor(id).subscribe({
      next: (result: Tour[]) => { 
        this.tours = result; 
        this.getAllCoupons(this.user?.id || 0);
        console.log(this.tours)
        console.log(this.tours);
        console.log(this.tours[0].keyPoints[0].tourId);
        if(this.tours.length === 0)
          {
            this.showNoToursAlert();
          }
       
      },
      error: (error) => {
        console.error('Error fetching tours:', error);
        if(this.tours.length === 0)
          {
            this.showNoToursAlert();
          }
        
      }
    });

    
  }

  private showNoToursAlert(): void {
    Swal.fire({
      title: 'No Tours Available!',
      text: 'You don’t have any tours yet. Start by creating your first tour!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Create Tour',
      cancelButtonText: 'Close',
      customClass: {
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/create-tour']);
      }
    });
  }
  

  onDistanceChanged(newDistance: number) { //nije dosao 
  console.log('tours for author')
    if(this.user?.id != null) {
      this.getTours(this.user?.id)
    } else {
      console.log("UserId is null.")
    }
    
  }

  getTagNames(tags: number[]): string[] {
    return tags.map(tagId => this.tourTagMap[tagId]).filter(tag => tag !== undefined);
  }

  onAddClicked() {
    this.router.navigate(['/create-tour']);

  }
    
  goToTourEquipment(id: number){
    this.router.navigate([`/tour/${id}/equipment`])
  }

  viewTourDetails(tour: Tour){
   
    this.router.navigate(['/tour-details', tour.id]);

  }

  getTourKeyPoints() : void {
   /* let keyPointIds = this.selectedTour.keyPointIds || [];
   this.selectedKeypoints = [];
    keyPointIds.forEach(id => {
      this.authorService.getKeyPointById(id).subscribe({
        next: (result: KeyPoint) => {
          
          this.selectedKeypoints.push(result);
        },
        error: (err: any) => console.log(err)

      })
    })*/
     
      this.selectedKeypoints = this.selectedTour.keyPoints;

   // this.selectedKeypoints.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));
  
    

  }

  getUpdatedTours(): void{
    
  
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);

     
    });
    
    

  }

  refreshPage():void{
    window.location.reload();
  }

  notifyTourUpdated(tour: Tour):void
  {
    
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);

    /*  if(user !== null && user.role === 'author')
      {
       const dialogRef = this.dialog.open(KeypointDialogComponent, {
          width: '20%',
          height: '20%'

        });

        dialogRef.afterClosed().subscribe(() => {
          this.tours.forEach((t, index) => {
            if (t.id === tour.id) {
                this.tours[index] = tour;  
            }
        });
        
          
        });
      }*/
    });

   

  }

  archiveTour(tour: Tour): void {
    if (tour.status !== 1) {
      console.log("Only published tours can be archived.");
      return;
    }
    tour.status = 2; 
    this.service.archiveTour(tour).subscribe({
      next: () => {
        console.log(`Tour ${tour.name} archived successfully.`);
        this.getTours(this.user?.id!); 
      },
      error: (error) => console.error('Error archiving tour:', error)
    });
  }

  publishTour(tour: Tour): void {
    if (tour.status === 2) {
      console.log("Only draft tours can be archived.");
      return;
    }
  
    if (tour.keyPoints.length < 2) {
      Swal.fire({
        icon: 'warning',
        title: 'Insufficient KeyPoints',
        text: 'You must have at least 2 KeyPoints to publish the tour.',
      });
      return;
    }
  
    tour.status = 1; 
    this.service.publishTour(tour).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Tour Published',
          text: `Tour ${tour.name} published successfully.`,
        });
        this.getTours(this.user?.id!); 
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error publishing tour. Please try again.',
        });
        console.error('Error publishing tour:', error);
      }
    });
  }
  

  reactivateTour(tour: Tour): void {
    if (tour.status !== 2) {
        console.log("Only archived tours can be reactivated.");
        return;
    }
    tour.status = 1; 
    this.service.reactivateTour(tour).subscribe({
        next: () => {
            console.log(`Tour ${tour.name} reactivated successfully.`);
            this.getTours(this.user?.id!); 
        },
        error: (error) => console.error('Error reactivating tour:', error)
    });
}

ngOnDestroy() {
  if (this.lengthUpdatedSubscription) {
    this.lengthUpdatedSubscription.unsubscribe();
  }
}

toggleChat(isChat: boolean): void {
  this.isChatOpen = isChat;
} 

createDiscount() {
  if (!this.startDate || !this.endDate || this.tourIds.length === 0) {
    this.dateError = true;
    return;
  }

  const diffInDays = (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays > 14 || diffInDays < 0) {
    this.dateError = true;
    return;
  }

  this.dateError = false;
  console.log('Discount being sent:', this.discount);

  const newSale: Sale = {
    discountPercentage: this.discount,
    startDate: this.startDate,
    endDate: this.endDate,
    tourIds: this.tourIds ,
    authorId: this.authorId

  };


  this.salesService.createSale(newSale).subscribe({
    next: (response) => {
      console.log('Popust uspešno kreiran:', response);
      Swal.fire({
        icon: 'success', // Ikonica uspeha
        title: 'Success!',
        text: 'Sale successfully created!',
        timer: 3000, // Automatsko zatvaranje posle 3 sekunde (opciono)
        showConfirmButton: false // Bez dugmeta "OK" (opciono)
      });
      
      
      this.discount = 0;
      this.startDate = null;
      this.endDate = null;
      this.tourIds = []; 
      this.showSaleCheckboxes = false;
    },
    error: (error) => {
      console.error('Greška prilikom kreiranja popusta:', error);
      Swal.fire({
        icon: 'error', // Ikonica greške
        title: 'Error!',
        text: 'Error creating sale. Please try again.',
        confirmButtonText: 'OK' // Tekst na dugmetu
      });
      
    }
  });
}
//kuponi
viewAllCoupons(): void{
  this.shouldRenderCouponForm = false; 
  this.shouldRenderCouponView = true;
}
getAllCoupons(authorId: number | undefined): void {
  if(authorId){
  this.couponService.getAll(authorId).subscribe({
    next: (coupons) => {
      this.couponMap.clear();
      coupons.results.forEach((coupon) => {
        if(coupon.tourId){
        this.couponMap.set(coupon.tourId, true);
        }
      });
      console.log(this.couponMap); 
    },
    error: (error) => {
      console.error('Error fetching coupons:', error);
    },
  });
}
}

openCouponForm(tour: Tour): void {
  this.selectedCouponTour = tour;
  this.shouldRenderCouponForm = true;
}
viewCouponDetails(tour: Tour): void {
  console.log(tour);
  if (!tour || !tour.id) {
    return;
  }

  this.selectedCouponTour = tour; 
  this.viewMode = true; 
  this.shouldRenderCouponForm = true; 
}

closeCouponForm(): void {
  this.viewMode=false;
  this.shouldRenderCouponForm = false;
  this.getAllCoupons(this.user?.id);
}
addCouponForAll(): void {
  this.selectedCouponTour = undefined;
  this.shouldRenderCouponForm = true;
}
closeCouponView(): void {
  this.shouldRenderCouponView = false;
  this.getAllCoupons(this.user?.id);
}

}