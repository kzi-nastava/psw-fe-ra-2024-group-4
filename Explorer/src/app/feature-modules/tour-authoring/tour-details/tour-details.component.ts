import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tour } from '../model/tour.model';
import { KeyPoint } from '../model/keypoint.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MarketplaceModule } from '../../marketplace/marketplace.module';
import { KeypointFormComponent } from '../keypoint-form/keypoint-form.component';

@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit {

  @Input() tour: Tour;
  @Output() tourUpdated = new EventEmitter<null>();
  
  keyPoints: KeyPoint[] = [];
  previuslyCreatedKeyPoints: KeyPoint[] = [];
  previouslyCreatedKeyPointIds: number[] = [];
  keyPointIds: number[] = [];
  user: User | undefined;
  shouldAddExisting: boolean = false;
  shouldCreateNew: boolean = false;
  shouldAddKeypoint: boolean = false;
  registerObj: boolean = false;

  constructor(private service: TourAuthoringService, private authService: AuthService){}

  ngOnInit(): void {
   
    this.getTourKeyPoints();
    
  }

  getTourKeyPoints() : void {
    this.keyPointIds = this.tour.keyPointIds || [];
   
    this.keyPointIds.forEach(id => {
      this.service.getKeyPointById(id).subscribe({
        next: (result: KeyPoint) => {
          this.keyPoints.push(result);
        },
        error: (err: any) => console.log(err)

      })
    })

    this.keyPoints.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));

    

  }


  getKeyPoints() : void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    if(this.user)
    { 

      this.service.getKeyPoints(this.user.id).subscribe({
      next: (result: KeyPoint[]) => { this.previuslyCreatedKeyPoints = result; 

        this.previuslyCreatedKeyPoints.forEach(kp => {
          this.previouslyCreatedKeyPointIds.push(kp.id || -1);
        })
       
        this.previouslyCreatedKeyPointIds.forEach(id => {
        
          if(this.keyPointIds.includes(id))
          {
          
            this.previuslyCreatedKeyPoints = this.previuslyCreatedKeyPoints.filter(kp => kp.id != id);
      
          }
            
        })

      },
      error: (err: any) => console.log(err)
    })
  }


  }

  onAddExistingClicked() {
    this.shouldAddExisting = true;
    this.getKeyPoints();
  }

  addKeypointToTour(keypoint: KeyPoint)
  {
    let tourid = this.tour.id;
    this.previuslyCreatedKeyPoints = this.previuslyCreatedKeyPoints.filter(kp => kp.id != keypoint.id);
    this.keyPoints.push(keypoint);

    if(this.user)
    {
     
      this.service.addKeyPointToTour(this.tour, keypoint.id).subscribe({
        next: (result: Tour) => { 
          this.tourUpdated.emit();
        },
        error: (err: any) => console.log(err)
      })

    }
    
  }

  onCreateNew()
  {
    this.shouldCreateNew = true;
    this.shouldAddKeypoint = true;
    this.registerObj = true;
  }

  notifyKeypointAdded(addedKeypoint: KeyPoint) : void
  {
      this.keyPoints.push(addedKeypoint);
    
 

  }
  
}
