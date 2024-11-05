import { Component, OnInit } from '@angular/core';
import { TourReview } from '../model/tour-reviews.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { jwtDecode } from 'jwt-decode';

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
  touristId: number;

  ngOnInit(): void {
    const token = localStorage.getItem('access-token');
    if(token){
      const decodedToken : any = jwtDecode(token);
      this.touristId = decodedToken.id;
    } else{
      throw new Error('Token not found');
    }
    this.getTourReviewsByTourist()
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

  getTourReviewsByTourist(): void{
    
    this.service.getTourReviewsByTourist(this.touristId).subscribe({
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
        this.getTourReviewsByTourist();
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
