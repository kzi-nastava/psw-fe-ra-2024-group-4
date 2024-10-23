import { Component, OnChanges, Input, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppReview } from '../../administration/model/appreview.model';
import { LayoutService } from '../layout.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-app-review',
  templateUrl: './app-review.component.html',
  styleUrls: ['./app-review.component.css']
})
export class AppReviewComponent implements OnChanges {

  @Output() appReviewUpdated = new EventEmitter<null>();
  @Input() appReview: AppReview;
  @Input() shouldEdit: boolean = true;
  user: User | null = null;

  constructor(private service: LayoutService, private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
    this.user = user; 
    console.log(user)
    });
  }

 
  loadAppReview(): void {
    if (this.user !== null) {
      if(this.user.role === 'tourist') {
        this.service.getTouristReview(this.user.id).subscribe({
          next: (result: AppReview) => {
            if (result) {
              this.appReviewForm.patchValue({
                grade: result.grade,
                comment: result.comment || ''
              });
              this.shouldEdit = false;
            } else {
              this.appReviewForm.reset(); 
              this.shouldEdit = true;
            }
          },
          error: () => {
            this.appReviewForm.reset(); 
            this.shouldEdit = true;
          }
        });
      } else if(this.user.role === 'author') {
        this.service.getAuthorReview(this.user.id).subscribe({
          next: (result: AppReview) => {
            if (result) {
              this.appReviewForm.patchValue({
                grade: result.grade,
                comment: result.comment || ''
              });
              this.shouldEdit = false;
            } else {
              this.appReviewForm.reset(); 
              this.shouldEdit = true;
            }
          },
          error: () => {
            this.appReviewForm.reset(); 
            this.shouldEdit = true;
          }
        });
      } else {
      }
     
    } else {
      alert('You must be logged in.')
    }
  }

  ngOnInit(): void {
    this.loadAppReview();
  }

  ngOnChanges(): void {
    this.loadAppReview();
  }

  appReviewForm = new FormGroup({
    grade: new FormControl(0, [Validators.required]),
    comment: new FormControl('', [Validators.required]),
  });


  addReview(): void {
    if(this.user != null) {
      if(this.user.role === 'tourist') {
        const appReview: AppReview = {
          id: this.user?.id,
          userId: this.user?.id,
          creationTime: new Date(),
          grade: this.appReviewForm.value.grade || 0,
          comment: this.appReviewForm.value.comment || "",
        };
        this.service.addTouristReview(appReview).subscribe({
          next: () => { 
            this.appReviewUpdated.emit();
            this.loadAppReview();
           }
        });
      } else if(this.user.role === 'author') {
        const appReview: AppReview = {
          id: this.user?.id,
          userId: this.user?.id,
          creationTime: new Date(),
          grade: this.appReviewForm.value.grade || 0,
          comment: this.appReviewForm.value.comment || "",
        };
        this.service.addAuthorReview(appReview).subscribe({
          next: () => { 
            this.appReviewUpdated.emit();
            this.loadAppReview();
           }
        });
      }      
    }
    
  }

  
  

}
