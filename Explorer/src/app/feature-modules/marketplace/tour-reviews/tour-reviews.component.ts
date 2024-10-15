import { Component, OnInit } from '@angular/core';
import { TourReview } from '../model/tour-reviews.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-reviews',
  templateUrl: './tour-reviews.component.html',
  styleUrls: ['./tour-reviews.component.css']
})
export class TourReviewsComponent implements OnInit{
  constructor(private service: MarketplaceService) { }
  
  tourReviews : TourReview[] = [];
  selectedTourReview : TourReview;
  shouldEdit: boolean = false;
  shouldRenderEquipmentForm: boolean = false;

  ngOnInit(): void {
    this.getTourReviews()
  }

  getTourReviews(): void{
    this.service.getTourReviews().subscribe({
      next:(result: PagedResults<TourReview>) => {
        this.tourReviews = result.results;
      },
      error:(err:any) => {
        console.log(err)
      }

    })
  }

  deleteTourReview(tourReview: TourReview) : void{
    this.service.deleteTourReview(tourReview).subscribe({
      next: () => {
        this.getTourReviews();
      },
    })
  }

  onAddClicked() : void{
    this.shouldRenderEquipmentForm = true;
    this.shouldEdit = false;
  }

  onEditClicked(tourReview: TourReview): void{
    this.shouldEdit = true;
    this.shouldRenderEquipmentForm = true;
    this.selectedTourReview = tourReview;
  }
}
