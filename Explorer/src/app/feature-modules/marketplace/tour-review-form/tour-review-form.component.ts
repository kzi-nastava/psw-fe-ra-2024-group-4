import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { TourReview } from '../model/tour-reviews.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


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
import { TourExecutionService } from '../../tour-execution/tour-execution.service';

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
  numberOfKP: number = 0;
  percentagePassed: number = 0;
  lastActivity: Date = new Date();

  constructor(private fb: FormBuilder, private service: MarketplaceService, private route: ActivatedRoute, private authService: AuthService, private tourEService: TourExecutionService, private router: Router) {
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
    this.checkConditions();
  }

  loadExistingReview() {   
    if(this.user === null){
      console.log('You must be logged in.')
      return;
    }
    this.service.getTourReview(this.user.id, this.tourId).subscribe(review => {
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

  checkConditions(){
    if (this.user === null){
      console.log('You must be logged in.')
      return;
    }
    
    this.service.getTourById(this.tourId, "tourist").subscribe({
      next: (result) => { 
        this.numberOfKP = result.keyPoints.length;

       }
    });

    this.tourEService.getTourExecutionByTourAndTourist(this.user?.id, this.tourId).subscribe({
      next: (result) => { 
        if (result.completedKeys?.length !== undefined && result.lastActivicy !== undefined) {
          this.percentagePassed = (result.completedKeys.length / this.numberOfKP)*100;
          this.lastActivity = result.lastActivicy;
        } else {
          this.percentagePassed = 0;
          
        }  
        
       }
    });

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    if(this.percentagePassed < 35 || this.lastActivity < sevenDaysAgo){
      this.showAlertAndRedirect()
    }

  }

  saveReview() {
    if (this.reviewForm.invalid) return;
    if (this.user === null){
      console.log('You must be logged in.')
      return;
    }

    this.checkConditions();

    const tourReview:  TourReview = {
      id: 0,
      idTour: this.tourId,
      idTourist: this.user.id,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      dateTour: this.lastActivity,
      dateComment: new Date(),
      images: this.reviewForm.value.image,
      percentagePassed: this.percentagePassed
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


  showAlertAndRedirect() {
    Swal.fire({
      icon: 'error', 
      title: 'Action not allowed',
      text: 'You cannot review this tour. You must complete at least 35% of the tour, and you have 7 days from your last activity to leave a review.',
      confirmButtonText: 'Okay',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['purchased-tours']); 
      }
    });
  }
}
