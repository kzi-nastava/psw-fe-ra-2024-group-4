import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { KeypointDialogComponent } from '../keypoint-dialog/keypoint-dialog.component';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
@Component({
  selector: 'xp-tours-for-author',
  templateUrl: './tours-for-author.component.html',
  styleUrls: ['./tours-for-author.component.css'],
})
export class ToursForAuthorComponent implements OnInit {
 
  tours: Tour[] = [];
  user: User | null = null;
  selectedTour: Tour;
  shouldViewTour: boolean = false;
  selectedKeypoints: KeyPoint[] = [];
  

  tourTagMap: { [key: number]: string } = {
    0: 'Cycling',
    1: 'Culture',
    2: 'Adventure',
    3: 'FamilyFriendly',
    4: 'Nature',
    5: 'CityTour',
    6: 'Historical',
    7: 'Relaxation',
    8: 'Wildlife',
    9: 'NightTour',
    10: 'Beach',
    11: 'Mountains',
    12: 'Photography',
    13: 'Guided',
    14: 'SelfGuided'
  };
  
  constructor(private authorService: TourAuthoringService, private service: TourService, private authService: AuthService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);

      if(user !== null && user.role === 'author')
      {
        this.getTours(user.id);
      }
    });
  }

  getTours(id: number): void {
    
    this.service.getToursForAuthor(id).subscribe({
      next: (result: Tour[]) => { 
        this.tours = result; 
        console.log(this.tours);
       
      },
      error: (error) => {
        console.error('Error fetching tours:', error);
        
      }
    });
  }

  getTagNames(tags: number[]): string[] {
    return tags.map(tagId => this.tourTagMap[tagId]).filter(tag => tag !== undefined);
  }

  onAddClicked() {
    this.router.navigate(['/create-tour']);

  }
    

  viewTourDetails(tour: Tour){

   
  
    
      this.selectedTour = tour;
     
      if(this.shouldViewTour == true)
        this.shouldViewTour = false;
    
      setTimeout(() => {
        this.getTourKeyPoints();
         this.shouldViewTour = true;
      }, 200);



   
   
  }

  getTourKeyPoints() : void {
   /* let keyPointIds = this.selectedTour.keyPointIds || [];
   this.selectedKeypoints = [];
    keyPointIds.forEach(id => {
      this.authorService.getKeyPointById(id).subscribe({
        next: (result: KeyPoint) => {
          
          this.selectedKeypoints.push(result);
        },
        error: (err: any) => console.log(err)

      })
    })*/
     
      this.selectedKeypoints = this.selectedTour.keyPoints;

   // this.selectedKeypoints.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));
  
    

  }

  getUpdatedTours(): void{
    
  
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);

      if(user !== null && user.role === 'author')
      {
       const dialogRef = this.dialog.open(KeypointDialogComponent, {
          width: '20%',
          height: '20%'

        });

        dialogRef.afterClosed().subscribe(() => {
        
          
        });
      }
    });
    

  }

  refreshPage():void{
    window.location.reload();
  }

  notifyTourUpdated(tour: Tour):void
  {
    
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);

      if(user !== null && user.role === 'author')
      {
       const dialogRef = this.dialog.open(KeypointDialogComponent, {
          width: '20%',
          height: '20%'

        });

        dialogRef.afterClosed().subscribe(() => {
          this.tours.forEach((t, index) => {
            if (t.id === tour.id) {
                this.tours[index] = tour;  
            }
        });
        
          
        });
      }
    });

   

  }
}