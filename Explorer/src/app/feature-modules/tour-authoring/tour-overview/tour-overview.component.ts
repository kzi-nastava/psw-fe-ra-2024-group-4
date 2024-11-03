import { Component, inject, OnInit } from '@angular/core';
import { TourOverview } from '../model/touroverview.model';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { TourOverviewDetailsComponent } from '../tour-overview-details/tour-overview-details.component';
import { KeyPoint } from '../model/keypoint.model';
import { MapService } from 'src/app/shared/map/map.service';
import { TourExecution } from '../model/tour-execution.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent implements OnInit {
  tours: TourOverview[] = [];
  user: User | null = null;
  tourExecution: TourExecution;
  currentPage: 0;
  pageSize: 0;
  readonly dialog = inject(MatDialog);
  isActive: boolean = false;

  constructor(private tourOverviewService: TourOverviewService, private mapService: MapService, private tourExecutionService: TourExecutionService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
    this.loadTours();
  }

  loadTours(): void {
    this.tourOverviewService.getAllWithoutReviews().subscribe({
      next: (data: PagedResults<TourOverview>) => {
        console.log('Tours loaded:', data);
        this.tours = data.results;
      },
      error: (err) => {
        console.error('Error loading tours:', err);
      }
    });
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

  startTour(tourId: number): void {

    this.tourExecution.locationId = 20;
    this.tourExecution.tourId = tourId;
    this.tourExecution.status = 0;
    this.tourExecution.touristId = this.user?.id;

    this.tourExecutionService.startTourExecution(this.tourExecution).subscribe({
      next: (data: TourExecution) => {
        console.log('Tours loaded:', data);
        this.isActive = true;
      },
      error: (err) => {
        console.error('Error creating execution:', err);
      }
    });
  }

  openReviews(tourId: number): void {
    this.dialog.open(TourOverviewDetailsComponent, {
      data: {
        tourId: tourId
      },
    });
  }
}
