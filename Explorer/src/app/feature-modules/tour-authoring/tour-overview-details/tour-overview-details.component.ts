import { Component, Inject, OnInit } from '@angular/core';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TourOverviewReview } from '../model/tour-overview-review.model';
import { TourReview } from '../../marketplace/model/tour-reviews.model';
import { PersonInfoService } from '../../person.info/person.info.service';
import { PersonInfo } from '../../person.info/model/info.model';
import { UserService } from 'src/app/shared/user/user-service.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { KeyPoint } from '../model/keypoint.model';
import { TourOverview } from '../model/touroverview.model';

@Component({
  selector: 'xp-tour-overview-details',
  templateUrl: './tour-overview-details.component.html',
  styleUrls: ['./tour-overview-details.component.css']
})
export class TourOverviewDetailsComponent implements OnInit {
  //TODO: napraviti novi model sa user icon, username, and comment
  reviews: TourOverviewReview[] = [];
  average: number = 0;
  tourId: number;
  firstKeyPoint: KeyPoint;

  constructor(private tourOverviewService: TourOverviewService, private personService: PersonInfoService, private userService: UserService
    ,@Inject(MAT_DIALOG_DATA) private data: {tourId: number, firstKeyPoint: KeyPoint })
  {
    this.tourId = data.tourId;
    this.firstKeyPoint = data.firstKeyPoint;
  }

  ngOnInit(): void {
    this.loadReviews();
    this.loadAverage();
  }

  loadAverage(): void {
    this.tourOverviewService.getAveragerating(this.tourId).subscribe({
      next: (data: TourOverview) => {
        if(data.rating != null && data.rating > 0) {
          this.average = data.rating;
        }
      }
    })
  }

  loadReviews(): void {
    this.tourOverviewService.getReviewsByTourId(this.tourId).subscribe({
      next: (data: PagedResults<TourReview>) => {
        data.results.forEach(r => {
          let pom: TourOverviewReview = {
            id: r.id,
            tourId: r.idTour,
            userId: r.idTourist,
            comment: r.comment,
            rating: r.rating
          }
          this.reviews.push(pom);
        })
        
        this.reviews.forEach(r => {
          this.personService.getTouristInfo(r.userId).subscribe({
            next: (data: PersonInfo) => {
              r.userAvatar = data.imageBase64;

              this.userService.getUsername(r.userId).subscribe({
                next: (data: User) => {
                  r.username = data.username;
                },
                error: (err) => {
                  console.error('Error loading username:', err);
                  alert("AAAAAAAAAAAAAA");
                }
              })
            },
            error: (err) => {
              console.error('Error loading personInfo:', err);
            }
          });
        })
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }
}
