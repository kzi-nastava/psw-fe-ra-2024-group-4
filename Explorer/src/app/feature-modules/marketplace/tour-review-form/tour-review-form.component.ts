import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { TourReview } from '../model/tour-reviews.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css']
})
export class TourReviewFormComponent implements OnChanges {
  @Output() tourReviewUpdated = new EventEmitter<null>();
  @Input() tourReview: TourReview;
  @Input() shouldEdit: boolean;
  touristId: number;

  constructor(private service: MarketplaceService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.tourReviewForm.reset();
    if(this.shouldEdit == true)
    {
      var patchValues = {
        rating: String(this.tourReview.rating),
        comment: this.tourReview.comment,
        images: String(this.tourReview.images)
      }
      this.tourReviewForm.patchValue(patchValues);
    }
  }

  tourReviewForm = new FormGroup({
    rating: new FormControl('', [Validators.min(1), Validators.max(5), Validators.required]),
    comment: new FormControl(''),
    images: new FormControl('')
  })

  addTourReview(): void{
    const token = localStorage.getItem('access-token');
    if(token){
      const decodedToken : any = jwtDecode(token);
      this.touristId = decodedToken.id;
    } else{
      throw new Error('Token not found');
    }
    
    const tourReview: TourReview = {
      //hardcode idjeva
      idTour: 1,
      idTourist: this.touristId,
      rating: Number(this.tourReviewForm.value.rating) || 0,
      comment: this.tourReviewForm.value.comment || '',
      dateTour: new Date(Date.now()),
      dateComment: new Date(Date.now()),
      images: [this.tourReviewForm.value.images || '']
    }

    this.service.addTourReview(tourReview).subscribe({
      next:() => {
        this.tourReviewUpdated.emit();
      }
    })
  }

  updateTourReview() : void{
    const tourReview: TourReview = {
      //hardcode idjeva
      idTour: 0,
      idTourist: this.touristId,
      rating: Number(this.tourReviewForm.value.rating) || 0,
      comment: this.tourReviewForm.value.comment || '',
      dateTour: new Date(Date.now()),
      dateComment: new Date(Date.now()),
      images: [this.tourReviewForm.value.images || '']
    }
    tourReview.id = this.tourReview.id;
    tourReview.idTour = this.tourReview.idTour;
    tourReview.idTourist = this.tourReview.idTourist;
    tourReview.dateTour = this.tourReview.dateTour;
    //dateComment se menja na nov datum (kada je editovan)

    this.service.updateTourReview(tourReview).subscribe({
      next:() => {
        this.tourReviewUpdated.emit();
      } 
    })
  }
}
