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

  isChatOpen: boolean = false; 
  chatMessage: string = 'This page displays a list of reviews for the tours. You can view details like the tour ID, tourist ID, rating, comment, attendance date, review date, and image paths. You can also edit or delete existing reviews and add new ones.';
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

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
