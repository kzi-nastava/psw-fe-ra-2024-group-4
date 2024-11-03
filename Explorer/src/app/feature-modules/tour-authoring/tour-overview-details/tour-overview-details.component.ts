import { Component, OnInit } from '@angular/core';
import { KeyPoint } from '../model/keypoint.model';
import { TourReview } from '../../marketplace/model/tour-reviews.model';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-overview-details',
  templateUrl: './tour-overview-details.component.html',
  styleUrls: ['./tour-overview-details.component.css']
})
export class TourOverviewDetailsComponent implements OnInit {
  firstKeyPoint: KeyPoint;
  //TODO: napraviti novi model sa user icon, username, and comment
  reviews: TourReview[] = [];
  average: number = 0;
  tourId: number;

  constructor(private tourOverviewService: TourOverviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.tourOverviewService.getReviewsByTourId(this.tourId).subscribe({
      next: (data: PagedResults<TourReview>) => {
        this.reviews = data.results
        this.reviews.forEach(x => this.average += x.rating)
        if(data.totalCount > 0) {
          this.average = this.average / data.totalCount
        }
      },
      error: (err) => {
        console.error('Error loading tours:', err);
      }
    });
  }
}
