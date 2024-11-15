import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { TourReview } from '../model/tour-reviews.model';
import { ActivatedRoute } from '@angular/router';


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css'],
})
export class TourReviewFormComponent implements OnInit {
  reviewForm: FormGroup;
  existingReview: any = null; 
  selectedFile: File | null = null;
  tourId: number;
  imagePreview: string | ArrayBuffer | null = null;
  user: User | null = null;

  constructor(private fb: FormBuilder, private service: MarketplaceService, private route: ActivatedRoute, private authService: AuthService) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      image: [null]
    });
    this.tourId = +this.route.snapshot.paramMap.get('tourId')!;
    this.authService.user$.subscribe((user) => {
      this.user = user; 
    });

  }

  ngOnInit(): void {
    this.loadExistingReview();
  }

  loadExistingReview() {   
    if(this.user === null){
      console.log('You must be logged in.')
      return;
    }
    this.service.getTourReview(this.user?.id, this.tourId).subscribe(review => {
      if (review) {
        this.existingReview = review;
        this.reviewForm.patchValue({
          rating: review.rating,
          comment: review.comment,
          image: review.images
        });
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveReview() {
    if (this.reviewForm.invalid) return;
    if (this.user === null){
      console.log('You must be logged in.')
      return;
    }
    const tourReview:  TourReview = {
      id: 0,
      idTour: this.tourId,
      idTourist: this.user.id,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      dateTour: new Date(),
      dateComment: new Date(),
      images: 'slika'
    }

    if (this.existingReview) {
      this.service.updateTourReview(tourReview).subscribe(() => {
        this.loadExistingReview();
      });
    } else {
      this.service.addTourReview(tourReview).subscribe(() => {
        this.loadExistingReview();
      });
    }
  }

  deleteReview() {
    if (this.existingReview) {
      this.service.deleteTourReview(this.existingReview).subscribe(() => {
        this.existingReview = null;
        this.reviewForm.reset();
      });
    }
  }
}
