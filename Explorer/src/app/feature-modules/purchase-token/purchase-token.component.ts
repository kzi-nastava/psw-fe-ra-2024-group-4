import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { forkJoin } from 'rxjs';
import { TourPurchaseToken } from 'src/app/feature-modules/payments/model/tour-purchase-token.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { PurchaseService } from 'src/app/feature-modules/tour-authoring/tour-purchase-token.service';
import { TourService } from 'src/app/feature-modules/tour-authoring/tour.service';
import { TourTags } from 'src/app/feature-modules/tour-authoring/model/tour.tags.model';
import { KeyPoint } from '../tour-authoring/model/keypoint.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-purchase-token',
  templateUrl: './purchase-token.component.html',
  styleUrls: ['./purchase-token.component.css']
})
export class PurchaseTokenComponent implements OnInit{
  purchasedTokens: TourPurchaseToken[] = [];
  tours: Tour[] = [];
  shouldDisplayMap: boolean = false;
  selectedTour: Tour;
  @Input() tourKeypoints: KeyPoint[] = [];

  constructor(private purchaseService: PurchaseService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
    this.authService.getUser().subscribe(user => {
      const userId = user.id; 
      
      this.purchaseService.getUserPurchasedTours(userId).subscribe(tokens => {
        this.purchasedTokens = tokens;

        const tourRequests = tokens.map(token => this.purchaseService.getTour(token.tourId));
        
        forkJoin(tourRequests).subscribe(tourDetails => {
          this.tours = tourDetails;
        });
      });
    });
  }
  
  getTagName(tagId: number): string {
    return TourTags[tagId];
  }

  showMapForTour(tour: any) {
    this.selectedTour = tour;
    this.shouldDisplayMap = true;
  }

  reviewTour(tour: Tour){
    this.router.navigate(['/tour-review', tour.id]);
  }

  closeMapForTour() {
    this.shouldDisplayMap = false; // Postavljamo na false kada zatvorimo mapu
  }
  
}
