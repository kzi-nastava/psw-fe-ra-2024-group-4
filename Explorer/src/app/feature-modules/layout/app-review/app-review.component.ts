import { Component, OnChanges, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppReview } from '../../administration/model/appreview.model';
import { LayoutService } from '../layout.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'xp-app-review',
  templateUrl: './app-review.component.html',
  styleUrls: ['./app-review.component.css']
})
export class AppReviewComponent implements OnInit, OnChanges {
  

  @Input() appReview: AppReview | null = null;
  @Input() shouldEdit: boolean = true;
  user: User | null = null;
  hoverRating: number = 0;

  appReviewForm = new FormGroup({
    grade: new FormControl<number | null>(0, [Validators.required]),
    comment: new FormControl<string>('', [Validators.required]),
  });

  constructor(private service: LayoutService, private authService: AuthService, private dialogRef: MatDialogRef<AppReviewComponent>) {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
    });
  }

  ngOnInit(): void {
    this.loadAppReview();
  }

  ngOnChanges(): void {
    this.loadAppReview();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  loadAppReview(): void {
    if (!this.user) {
      alert('You must be logged in.');
      return;
    }

    if (this.user.role === 'tourist') {
      this.service.getTouristReview(this.user.id).subscribe({
        next: (result: AppReview) => {
          if (result) {
            this.appReviewForm.patchValue({
              grade: result.grade,
              comment: result.comment || ''
            });
            this.shouldEdit = false;
          } else {
            this.appReviewForm.reset({ grade: 0, comment: '' });
            this.shouldEdit = true;
          }
        },
        error: () => {
          this.appReviewForm.reset({ grade: 0, comment: '' });
          this.shouldEdit = true;
        }
      });
    } else if (this.user.role === 'author') {
      this.service.getAuthorReview(this.user.id).subscribe({
        next: (result: AppReview) => {
          if (result) {
            this.appReviewForm.patchValue({
              grade: result.grade,
              comment: result.comment || ''
            });
            this.shouldEdit = false;
          } else {
            this.appReviewForm.reset({ grade: 0, comment: '' });
            this.shouldEdit = true;
          }
        },
        error: () => {
          this.appReviewForm.reset({ grade: 0, comment: '' });
          this.shouldEdit = true;
        }
      });
    }
  }

  setRating(star: number): void {
    this.appReviewForm.patchValue({ grade: star });
  }

  addReview(): void {
    if (!this.user) {
      alert('You must be logged in.');
      return;
    }

    const currentGrade = this.appReviewForm.value.grade ?? 0;
    const currentComment = this.appReviewForm.value.comment ?? '';

    const appReview: AppReview = {
      id: this.user.id,
      userId: this.user.id,
      creationTime: new Date(),
      grade: currentGrade,
      comment: currentComment
    };

    

    if (this.user.role === 'tourist') {
      this.service.addTouristReview(appReview).subscribe({
        next: () => {
          this.loadAppReview();
        }
      });
    } else if (this.user.role === 'author') {
      this.service.addAuthorReview(appReview).subscribe({
        next: () => {
          this.loadAppReview();
        }
      });
    }
  }

}
