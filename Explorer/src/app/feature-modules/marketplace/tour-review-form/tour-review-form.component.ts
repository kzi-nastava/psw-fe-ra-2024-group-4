import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { TourReview } from '../model/tour-reviews.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/env/environment';


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
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';

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
  imageBase64: string;
  editMode: boolean = false;

  isChatOpen: boolean = false; 
  chatMessage: string = 'You can leave a review for this tour by providing a rating, comment, and optional image. If you already have a review, you can view, edit, or delete it. Note: You must have completed more than 35% of the tour and have participated within the last 7 days to leave a review.';
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  constructor(private fb: FormBuilder, private service: MarketplaceService, private route: ActivatedRoute, private authService: AuthService, private tourEService: TourExecutionService, private router: Router) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      image: new FormControl(''),
      imageBase64: new FormControl(''),
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

  getImage(image: string)
  {
    return environment.webroot + image;
  }

  loadExistingReview() {  
    if(this.user === null){
      console.log('You must be logged in.')
      return;
    }
    this.service.getTourReview(this.user.id, this.tourId).subscribe(review => {
      console.log(review)
      if (review) {
        this.existingReview = review;
        console.log(this.existingReview.id)
        this.reviewForm.patchValue({
          rating: review.rating,
          comment: review.comment,
          image: review.image
        });
      }
    });
  }

  editReview() {
    this.editMode = true;
  }

  onFileSelected(event: any): void {
    const file:File = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            this.imageBase64 = reader.result as string;
            this.reviewForm.patchValue({
              imageBase64: this.imageBase64
            });
        };
        reader.readAsDataURL(file); 
  }

  checkConditions(){
    if (this.user === null){
      console.log('You must be logged in.')
      return;
    }
    
    this.service.getTourWithKp(this.tourId).subscribe({
      next: (result) => { 
        console.log(result)
        this.numberOfKP = result.keyPoints.length;
        if (this.user === null){
          console.log('You must be logged in.')
          return;
        }
        this.tourEService.getTourExecutionByTourAndTourist(this.user?.id, this.tourId).subscribe({
          next: (result) => { 
            if (result.completedKeys?.length !== undefined && result.lastActivity !== undefined) {
              this.percentagePassed = (result.completedKeys.length / this.numberOfKP)*100;
              this.lastActivity = result.lastActivity;
              
            } else {
              this.percentagePassed = 0;
              console.log("Completed key points or last activity undefined.")
              
            }  
            const today = new Date();
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            const lastActivityDate = new Date(this.lastActivity);

            if(this.percentagePassed < 35 || lastActivityDate< sevenDaysAgo){
              this.showAlertAndRedirect()
            }
            
           },
           error: (err) => {
             console.error('Error loading tours:', err);
             this.showAlertAndRedirect()
           }
        });
       }
    });
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
      image: this.reviewForm.value.image,
      imageBase64: this.reviewForm.value.imageBase64 || "",
      percentageCompleted: this.percentagePassed
    }

    if (this.existingReview) {
      tourReview.id = this.existingReview.id;
      this.service.updateTourReview(tourReview).subscribe(() => {
        this.loadExistingReview();
        this.editMode = false;
      });
    } else {
      this.service.addTourReview(tourReview).subscribe(() => {        
        this.loadExistingReview();
        this.editMode = false;
      });
    }
  }

  showSuccessAlert() {
    Swal.fire({
      title: 'Success!',
      text: 'Tour review successfuly saved.',
      icon: 'success',
      confirmButtonText: 'Okay'
    });
  }

  showDeleteAlert() {
    Swal.fire({
      title: 'Success!',
      text: 'Tour review successfuly deleted.',
      icon: 'success',
      confirmButtonText: 'Okay'
    });
  }



  deleteReview() {
    if (this.existingReview) {
      this.service.deleteTourReview(this.existingReview).subscribe(() => {
        this.existingReview = null;
      this.reviewForm.reset();
      this.reviewForm.patchValue({
        rating: null,
        comment: '',
        image: '',
        imageBase64: ''
      });
      this.editMode = false;
      this.showDeleteAlert();
      this.ngOnInit();
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
