import { Component, OnInit } from '@angular/core';
import { AppReview } from '../model/appreview.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from '../model/equipment.model';



@Component({
  selector: 'xp-app-review-table',
  templateUrl: './app-review-table.component.html',
  styleUrls: ['./app-review-table.component.css']
})
export class AppReviewTableComponent {
  reviews: AppReview[] = [];
  
  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getAppReviews();
  }

  getAppReviews(): void {
    this.service.getAppReviews().subscribe({
      next: (result: PagedResults<AppReview>) => {
        this.reviews = result.results;
      },
      error: () => {
      }
    })
  }

}
