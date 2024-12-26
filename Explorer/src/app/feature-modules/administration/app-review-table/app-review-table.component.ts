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
  isChatOpen: boolean = false; 
  chatMessage: string = 'Welcome to the App Reviews page! Here, you can see all user reviews, including their grades, comments, and the date they were submitted.';
 
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }
  
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
