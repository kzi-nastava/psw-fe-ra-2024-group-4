import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { forkJoin } from 'rxjs';
import { TourPurchaseToken } from 'src/app/feature-modules/payments/model/tour-purchase-token.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { PurchaseService } from 'src/app/feature-modules/tour-authoring/tour-purchase-token.service';
import { TourService } from 'src/app/feature-modules/tour-authoring/tour.service';
import { TourTags } from 'src/app/feature-modules/tour-authoring/model/tour.tags.model';
import { KeyPoint } from '../tour-authoring/model/keypoint.model';
import { Router } from '@angular/router';
import { TourExecution } from '../tour-authoring/model/tour-execution.model';
import { TourExecutionService } from '../tour-execution/tour-execution.service';
import { PositionSimulator } from '../tour-authoring/model/position-simulator.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-purchase-token',
  templateUrl: './purchase-token.component.html',
  styleUrls: ['./purchase-token.component.css']
})
export class PurchaseTokenComponent implements OnInit{
  purchasedTokens: TourPurchaseToken[] = [];
  tourExecution: TourExecution = {} as TourExecution;
  tourExecutions: Map<number, TourExecution> = new Map();
  position: PositionSimulator | null = null;
  isActive: boolean = false;
  tours: Tour[] = [];
  shouldDisplayMap: boolean = false;
  selectedTour: Tour;
  userId: number = -1;
  @Input() tourKeypoints: KeyPoint[] = [];


  constructor(private purchaseService: PurchaseService, private authService: AuthService, private router: Router,
    private tourExecutionService: TourExecutionService) {}

  isChatOpen: boolean = false; 
  chatMessage: string = 'Click the View Map button to see the map with the tours key points.Click the Start Tour button to begin the selected tour.Use the Report Problem button to report any issues you encounter.';  


  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }




  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      this.userId = user.id;

      if (user) {
        this.tourExecutionService.getPositionByTourist(user.id).subscribe({
          next: (position: PositionSimulator) => {
            console.log('Position retrieved:', position);
            this.position = position;
          },
          error: (err) => {
            console.error('Error retrieving position:', err);
          },
        });
      }

      this.purchaseService.getUserPurchasedTours(this.userId).subscribe((tokens) => {
        this.purchasedTokens = tokens;

        if (tokens.length === 0) {
          // Show SweetAlert if no tours have been purchased
          Swal.fire({
            icon: 'info',
            title: 'No Purchased Tours',
            text: "You haven't purchased any tours yet.",
            confirmButtonText: 'Go to Tours Overview',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/tour-overview']);
            }
          });
          return; // Exit if no tours are found
        }

        const tourRequests = tokens.map((token) =>
          this.purchaseService.getTour(token.tourId)
        );

        forkJoin(tourRequests).subscribe((tourDetails) => {
          this.tours = tourDetails.map((tour, index) => {
            const token = tokens[index];
            return {
              ...tour,
              price: token.price,
            };
          });

          this.tours = tourDetails;
          this.loadTourExecutions();
        });
      });
    });
  }

  
  
  getTagName(tagId: number): string {
    return TourTags[tagId];
  }

  showMapForTour(tour: any) {
    this.selectedTour = tour;
    this.shouldDisplayMap = true;
  }

  reviewTour(tour: Tour){
    this.router.navigate(['/tour-review', tour.id]);
  }

  closeMapForTour() {
    this.shouldDisplayMap = false; 
  }


  //startovanje ture i njegova logika

  

  startTour(tourId: number): void {
    if (!this.position) {
      Swal.fire({
          title: 'Position Required',
          text: 'Please set your starting location in the position simulator before starting a tour.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Go to Position Simulator',
          cancelButtonText: 'Cancel',
          allowOutsideClick: false,
          customClass: {
              confirmButton: 'swal2-confirm-button',
              cancelButton: 'swal2-cancel-button'
          }
      }).then((result) => {
          if (result.isConfirmed) {
              this.router.navigate(['/position-simulator']);
          }
      });
      return;
  }
  

    // Ensure tourExecution is initialized with all required properties
    this.tourExecution = {
        locationId: this.position.id,
        tourId: tourId,
        status: 0,
        lastActivity: new Date(),
        touristId: this.userId || 0, // Default to 0 if user ID is null
        completedKeys: [] // Ensure this is sent as an empty array
    };

    this.tourExecutionService.startTourExecution(this.tourExecution).subscribe({
        next: (data: TourExecution) => {
            console.log('Tour execution started:', data);
            this.isActive = true;
            this.loadTourExecutions();
            this.router.navigate(['/position-simulator']);
        },
        error: (err) => {
            console.error('Error creating execution:', err);
        }
    });
}


  abandonTourExecution(tourExecutionId?: number)
  {
    if(tourExecutionId !== null && tourExecutionId !== undefined)
      {
    this.tourExecutionService.abandonTourExecution(tourExecutionId).subscribe({  
      next: (data: TourExecution) => {
          console.log('Tour execution started:', data);
          this.isActive = false;
          this.loadTourExecutions();
      },
      error: (err) => {
          console.error('Error creating execution:', err);
      }
  });
}
  }

  loadTourExecutions(): void {
    if (this.userId != -1) {
        this.tours.forEach((tour) => {
            this.tourExecutionService.getTourExecutionByTourAndTourist(this.userId, tour.id).subscribe({
              next: (execution: TourExecution | null) => {
                if (execution) {
                  
                    this.tourExecutions.set(tour.id || -1, execution);
                 
                    
                    if(execution.status === 0)
                      this.isActive = true;
                } else {
                
                }
            },
                error: (err) => {
                    console.error(`Error loading execution for tour ${tour.id}:`, err);
                }
            });
        });
    }
  }
  
}
