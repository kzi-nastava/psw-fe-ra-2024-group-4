import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { catchError, forkJoin, of } from 'rxjs';
import { TourPurchaseToken } from 'src/app/feature-modules/tour-authoring/model/tour-purchase-token.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { PurchaseService } from 'src/app/feature-modules/tour-authoring/tour-purchase-token.service';
import { TourTags } from 'src/app/feature-modules/tour-authoring/model/tour.tags.model';
import { TourExecution } from 'src/app/feature-modules/tour-authoring/model/tour-execution.model';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour-execution.service';
import { PositionSimulator } from 'src/app/feature-modules/tour-authoring/model/position-simulator.model';

@Component({
  selector: 'xp-purchase-token',
  templateUrl: './purchase-token.component.html',
  styleUrls: ['./purchase-token.component.css']
})
export class PurchaseTokenComponent implements OnInit {
  purchasedTokens: TourPurchaseToken[] = [];
  tours: Tour[] = [];
  tourExecutions: TourExecution[] = [];
  userId: number;
  position: PositionSimulator | null = null;

  constructor(
    private purchaseService: PurchaseService,
    private authService: AuthService,
    private tourExecutionService: TourExecutionService
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.userId = user.id;

      if (user) {
        this.tourExecutionService.getPositionByTourist(user.id).subscribe({
            next: (position: PositionSimulator) => {
                console.log('Position retrieved:', position);
                this.position = position;

                this.loadTours(this.userId);
            },
            error: (err) => {
                console.error('Error retrieving position:', err);
            }
        });
      }
    });
  }

  loadTours(userId: number): void {
    this.purchaseService.getUserPurchasedTours(userId).subscribe({
      next: (tokens) => {
        this.purchasedTokens = tokens;
  
        // Step 1: Get details of all tours
        const tourRequests = tokens.map((token) =>
          this.purchaseService.getTour(token.tourId).pipe(
            catchError((error) => {
              console.error(`Error fetching tour details for tour ID: ${token.tourId}`, error);
              return of(null); // Handle the error and continue with the remaining requests
            })
          )
        );
  
        forkJoin(tourRequests).subscribe({
          next: (tourDetails) => {
            // Filter out any null results due to errors and also filter out tours with status 0 (Draft)
            this.tours = tourDetails.filter((tour) => tour !== null && tour.status !== 0) as Tour[];
  
            // Step 2: Get executions for each tour
            const executionRequests = this.tours.map((tour) =>
              this.tourExecutionService.getTourExecutionByTourAndTourist(userId, tour.id!).pipe(
                catchError((error) => {
                  console.error(`Error fetching execution for tour ID: ${tour.id}`, error);
                  return of(null); // Handle 404 or other errors
                })
              )
            );
  
            forkJoin(executionRequests).subscribe({
              next: (executionDetails) => {
                // Filter out any null results due to missing executions
                this.tourExecutions = executionDetails.filter((execution) => execution !== null) as TourExecution[];
              },
              error: (err) => {
                console.error('Error fetching tour executions:', err);
              }
            });
          },
          error: (err) => {
            console.error('Error fetching tour details:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching purchased tours:', err);
      }
    });
  }


  startTour(tourId?: number): void {
    if (!this.position) {
        console.error('Position is null. Cannot start tour without a position.');
        return;
    }

    if(tourId !== undefined){
    // Ensure tourExecution is initialized with all required properties
    var tourExecution: TourExecution = {
        locationId: this.position.id,
        tourId: tourId,
        status: 0,
        lastActivicy: new Date(),
        touristId: this.userId, // Default to 0 if user ID is null
        completedKeys: [] // Ensure this is sent as an empty array
    };

    this.tourExecutionService.startTourExecution(tourExecution).subscribe({
        next: (data: TourExecution) => {
            console.log('Tour execution started:', data);
            this.loadTours(this.userId);
        },
        error: (err) => {
            console.error('Error creating execution:', err);
        }
    });
    }
  }

  // Method to check if a tour is activated
  isTourActivated(tourId?: number): boolean {
    return this.tourExecutions.some(execution => execution.tourId === tourId || execution.status !== 0);
  }

  getTagName(tagId: number): string {
    return TourTags[tagId];
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case TourStatus.Draft:
        return 'Draft';
      case TourStatus.Published:
        return 'Published';
      case TourStatus.Archived:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }


}

export enum TourStatus {
  Draft = 0,
  Published = 1,
  Archived = 2
}