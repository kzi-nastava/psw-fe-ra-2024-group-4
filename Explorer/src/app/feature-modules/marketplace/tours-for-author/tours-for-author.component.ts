import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';

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
  
  constructor(private service: TourService, private authService: AuthService, private router: Router) { }

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
    this.shouldViewTour = true;
  }

  getUpdatedTours(): void{
    
  
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);

      if(user !== null && user.role === 'author')
      {

        this.getTours(user.id);
      }
    });
    

  }

  
}
