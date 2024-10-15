import { Component, OnInit } from '@angular/core';
import { tourReview } from '../model/tour-reviews.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-reviews',
  templateUrl: './tour-reviews.component.html',
  styleUrls: ['./tour-reviews.component.css']
})
export class TourReviewsComponent implements OnInit{
  constructor(private service: MarketplaceService) { }
  
  tourReviews : tourReview[]

  ngOnInit(): void {
    this.service.getTourReviews().subscribe({
      next:(result: PagedResults<tourReview>) => {
        this.tourReviews = result.results;
      },
      error:(err:any) => {
        console.log(err)
      }

    })
  }
}
