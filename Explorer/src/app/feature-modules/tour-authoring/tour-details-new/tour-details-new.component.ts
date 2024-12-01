import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tour } from '../model/tour.model';
import { KeyPoint, PublicStatus } from '../model/keypoint.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../tour.service';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/shared/map/map.service';

@Component({
  selector: 'xp-tour-details-new',
  templateUrl: './tour-details-new.component.html',
  styleUrls: ['./tour-details-new.component.css'],
})
export class TourDetailsNewComponent implements OnInit {

  
  tourId: number = -1;
  tours: Tour[] = [];
  tour: Tour;
  isChatOpen: boolean = false; 
  chatMessage: string = 'Welcome! Explore our map and click to create new key points!';
  @Input() tourKeypoints: KeyPoint[] = [];
  @Output() tourUpdated = new EventEmitter<Tour>();
  @Output() distanceChanged = new EventEmitter<number>();
  
  keyPoints: KeyPoint[] = [];
  previuslyCreatedKeyPoints: KeyPoint[] = [];
  previouslyCreatedKeyPointIds: number[] = [];
  keyPointIds: number[] = [];
  user: User | undefined;
  shouldAddExisting: boolean = false;
  shouldCreateNew: boolean = false;
  shouldAddKeypoint: boolean = false;
  registerObj: boolean = false;
  shouldDisplayMap: boolean = false;
  registerObjRoute: boolean = false;
  private lengthUpdatedSubscription!: Subscription;

  constructor(private service: TourAuthoringService, private authService: AuthService, private route: ActivatedRoute, private tourService: TourService, private mapService: MapService){}

  ngOnInit(): void {
   
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.tourId = id ? +id : -1; 
    });
    this.authService.user$.subscribe((user) => {
      this.user = user; 

      if(user !== null && user.role === 'author')
      {
        this.getTours(user.id);
        

        
      }
    });

    this.mapService.currentDistance.subscribe(distance =>
      { console.log('pzovano')
       const tour = this.tours.find(t => t.id === distance.tourId);
       if (tour) {
         tour.lengthInKm = distance.distance;
       }
      }
    );
    
    
  }

  getTours(id: number) : void {
    this.tourService.getToursForAuthor(id).subscribe({
      next: (result: Tour[]) => { 
        this.tours = result; 
        
       this.tours.forEach(selected => {
        if (selected.id === this.tourId) {
          this.tour = selected; 
          console.log(this.tour);
          this.getTourKeyPoints();
        }
      });
      },
      error: (error) => {
        console.error('Error fetching tours:', error);
        
      }
    });
  }
  
 

  getTourKeyPoints() : void {
    
   
   this.keyPoints = this.tour.keyPoints;
   this.onCreateNew();
   
  

  }


  
  getImage(image: string)
  {
    return environment.webroot + image;
  }

  onCreateNew()
  {
    if(this.shouldCreateNew)
      this.shouldCreateNew = false;

    setTimeout(() => {
    this.shouldCreateNew = true;
    this.shouldAddKeypoint = true;
    this.registerObjRoute = true;
  }, 200);
  }

  notifyKeypointAdded(newTour: Tour) : void
  {
     // this.keyPoints.push(addedKeypoint);

      this.tour = newTour;
      this.getTourKeyPoints();
      if(this.shouldCreateNew)
        this.shouldCreateNew = false;
  
      setTimeout(() => {
      this.shouldCreateNew = true;
      this.shouldAddKeypoint = true;
      this.registerObjRoute = true;
    }, 200);

    this.tourUpdated.emit(newTour);
    
 

  }

  

  onDistanceChanged(newDistance: number) {
    this.distanceChanged.emit(newDistance);
    
    console.log('tour details')
  }

  notifyTourUpdated(): void{
    this.tourUpdated.emit();
  }

  showMapForTour(tour: any) {
    console.log('xdd');
    console.log(tour);
    console.log(tour.keyPointIds);
    this.shouldDisplayMap = true;
  }
  closeMapForTour() {
    this.shouldDisplayMap = false; // Postavljamo na false kada zatvorimo mapu
  }
  getStatusLabel(status: PublicStatus): string {
    switch (status) {
      case PublicStatus.PRIVATE: return 'Private';
      case PublicStatus.REQUESTED_PUBLIC: return 'Requested Public';
      case PublicStatus.PUBLIC: return 'Public';
      default: return 'Unknown';
    }
  }

  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  
  
}

