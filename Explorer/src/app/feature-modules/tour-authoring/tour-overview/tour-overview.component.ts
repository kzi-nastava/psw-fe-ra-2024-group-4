import { Component, inject, OnInit } from '@angular/core';
import { TourOverview } from '../model/touroverview.model';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { TourOverviewDetailsComponent } from '../tour-overview-details/tour-overview-details.component';
import { KeyPoint } from '../model/keypoint.model';
import { MapService } from 'src/app/shared/map/map.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../cart-overview.service';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent implements OnInit {
  tours: TourOverview[] = [];
  currentPage: 0;
  pageSize: 0;
  readonly dialog = inject(MatDialog);

  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable(); 


  constructor(private tourOverviewService: TourOverviewService, 
    private mapService: MapService, 
    private router: Router,
    private cartService: CartService) {}

  ngOnInit(): void {
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

  openReviews(tourId: number): void {
    this.dialog.open(TourOverviewDetailsComponent, {
      data: {
        tourId: tourId
      },
    });
  }

  addToCart(tour: TourOverview): void {
    this.cartService.addToCart({
      tourId : tour.tourId,
      tourName: tour.tourName, 
      price: tour.price 
    });
    const currentCount = this.cartItemCount.value;
    this.cartItemCount.next(currentCount + 1); 
  }

//   addToCart(tour: TourOverview): void {
//     const fullTour = this.cartService.getTourById(tour.tourId); 
//     this.cartService.addToCart({
//         tourName: tour.tourName, 
//         price: fullTour ? fullTour.price : 0 
//     });
//     const currentCount = this.cartItemCount.value;
//     this.cartItemCount.next(currentCount + 1); 
// }

  openCart(): void {
    this.router.navigate(['/cart']);
  }
}
