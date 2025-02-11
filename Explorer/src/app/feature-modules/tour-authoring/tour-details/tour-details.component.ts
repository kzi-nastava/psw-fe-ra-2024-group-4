import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Tour } from '../model/tour.model';
import { KeyPoint,PublicStatus } from '../model/keypoint.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MarketplaceModule } from '../../marketplace/marketplace.module';
import { KeypointFormComponent } from '../keypoint-form/keypoint-form.component';
import { environment } from 'src/env/environment';
@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit {

  @Input() tour: Tour;
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

  constructor(private service: TourAuthoringService, private authService: AuthService){}

  ngOnInit(): void {
   
    this.getTourKeyPoints();
    
  }
 

  getTourKeyPoints() : void {
   
   this.keyPoints = this.tour.keyPoints;
   
  

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
  
}
