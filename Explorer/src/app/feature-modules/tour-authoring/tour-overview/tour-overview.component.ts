import { Component, inject, numberAttribute, OnInit, OnDestroy } from '@angular/core';
import { TourOverview } from '../model/touroverview.model';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { TourOverviewDetailsComponent } from '../tour-overview-details/tour-overview-details.component';
import { KeyPoint } from '../model/keypoint.model';
import { MapService } from 'src/app/shared/map/map.service';
import { TourExecution, CompletedKeys } from '../model/tour-execution.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PositionSimulator } from '../model/position-simulator.model';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent implements OnInit, OnDestroy {
  tours: TourOverview[] = [];
  user: User | null = null;
  tourExecution: TourExecution = {} as TourExecution;
  keyPoints: KeyPoint[] = []; //
  currentPage: 0;
  tourExecutions: Map<number, TourExecution> = new Map();
  pageSize: 0;
  readonly dialog = inject(MatDialog);
  activeTourId: number | null = null;
  isActive: boolean = false;
  position: PositionSimulator | null = null;
  private positionInterval: any;

  constructor(private tourOverviewService: TourOverviewService, private mapService: MapService, private tourExecutionService: TourExecutionService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
      if (user) {
        this.tourExecutionService.getPositionByTourist(user.id).subscribe({
            next: (position: PositionSimulator) => {
                console.log('Position retrieved:', position);
                this.position = position;

                this.positionInterval = setInterval(() => {
                  this.tourExecutionService.getPositionByTourist(user.id).subscribe({
                    next: (newPosition: PositionSimulator) => {
                      console.log('Updated position:', newPosition);
                      this.position = newPosition;

                      this.checkProximityToKeyPoints(); //
                    },
                    error: (err) => {
                      console.error('Error retrieving position:', err);
                    }
                  });
                }, 10000);
            },
            error: (err) => {
                console.error('Error retrieving position:', err);
            }
        });
    }
    });

    
    this.loadTours();
  }

  ngOnDestroy(): void {
    if (this.positionInterval) {
      clearInterval(this.positionInterval);
    }
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

  // Izračunavanje udaljenosti između dve GPS pozicije koristeći Haversine formulu
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Poluprečnik Zemlje u metrima
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // u metrima
  }

  // Provera blizine turista ključnim tačkama
  checkProximityToKeyPoints(): void {
    const proximityThreshold = 100; // Definiši prag blizine u metrima

    if (!this.position || !this.position.latitude || !this.position.longitude) {
      return;
    }

    for (const keyPoint of this.keyPoints) {
      const distance = this.calculateDistance(
        this.position.latitude, this.position.longitude,
        keyPoint.latitude, keyPoint.longitude
      );

      if (distance <= proximityThreshold && keyPoint.id !== undefined && !this.isKeyPointCompleted(keyPoint.id)) {
        // Ako je ključna tačka blizu i nije kompletirana, označi je kao kompletiranu
        this.markKeyPointAsCompleted(keyPoint.id);
      }      
    }
  }

  isKeyPointCompleted(keyPointId: number): boolean {
    return this.tourExecution.completedKeys?.some((completedKey) => completedKey.keyPointId === keyPointId) || false;
  }

  markKeyPointAsCompleted(keyPointId: number | undefined): void {
    // Proverava da li je `keyPointId` definisan
    if (keyPointId === undefined) {
      console.error('KeyPointId is undefined. Cannot mark as completed.');
      return;
    }
  
    const completionTime = new Date();
    const completedKey: CompletedKeys = { keyPointId, completionTime };
  
    // Dodaj završeni ključ u postojeće ključeve
    this.tourExecution.completedKeys = [
      ...(this.tourExecution.completedKeys || []),
      completedKey
    ];
  
    // Pozivanje metode completeKeyPoint
    if (this.tourExecution.id) { // Pretpostavljamo da tourExecution ima id
      this.tourExecutionService.completeKeyPoint(this.tourExecution.id, keyPointId).subscribe({
        next: () => {
          console.log(`Key point ${keyPointId} marked as completed at ${completionTime}`);
        },
        error: (err) => {
          console.error(`Error marking key point ${keyPointId} as completed:`, err);
        }
      });
    } else {
      console.error('Tour execution ID is not defined. Cannot complete key point.');
    }
  }
  
  

  ///////////////////////////

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

  startTour(tourId: number): void {
    if (!this.position) {
        console.error('Position is null. Cannot start tour without a position.');
        return;
    }

    // Ensure tourExecution is initialized with all required properties
    this.tourExecution = {
        locationId: this.position.id,
        tourId: tourId,
        status: 0,
        lastActivicy: new Date(),
        touristId: this.user?.id || 0, // Default to 0 if user ID is null
        completedKeys: [] // Ensure this is sent as an empty array
    };

    this.tourExecutionService.startTourExecution(this.tourExecution).subscribe({
        next: (data: TourExecution) => {
            console.log('Tour execution started:', data);
            this.isActive = true;
            this.loadTourExecutions();
        },
        error: (err) => {
            console.error('Error creating execution:', err);
        }
    });
}

  completeTourExecution(tourExecutionId?: number)
  {
    
    if(tourExecutionId !== null && tourExecutionId !== undefined)
    {
      this.tourExecutionService.completeTourExecution(tourExecutionId).subscribe({ 
        next: (data: TourExecution) => {
            console.log('Tour execution started:', data);
            this.isActive = false;
            this.loadTourExecutions()
        },
        error: (err) => {
            console.error('Error creating execution:', err);
        }
    });
    }
    
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

  openReviews(tourId: number): void {
    this.dialog.open(TourOverviewDetailsComponent, {
      data: {
        tourId: tourId
      },
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
}
