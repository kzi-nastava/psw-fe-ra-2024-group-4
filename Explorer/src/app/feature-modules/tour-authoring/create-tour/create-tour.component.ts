import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';

export enum TourTags {
  Cycling = 0,
  Culture = 1,
  Adventure = 2,
  FamilyFriendly = 3,
  Nature = 4,
  CityTour = 5,
  Historical = 6,
  Relaxation = 7,
  Wildlife = 8,
  NightTour = 9,
  Beach = 10,
  Mountains = 11,
  Photography = 12,
  Guided = 13,
  SelfGuided = 14,
}

@Component({
  selector: 'xp-create-tour',
  templateUrl: './create-tour.component.html',
  styleUrls: ['./create-tour.component.css'],
})
export class CreateTourComponent  implements OnChanges {

  @Output()tourUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  user: User | null = null;
  tourTags = Object.keys(TourTags)
  .filter(key => isNaN(Number(key)))
  .map((tag, index) => ({ index, label: tag }));


  constructor(private service: TourService, private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);

      
    });
  }

  ngOnChanges(): void {
    this.tourForm.reset();

  }

  

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    difficulty: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    tags: new FormControl<number[]>([])
  });

  addTour(): void {
    if(this.user!== null && this.user?.role === 'author' && this.tourForm.value.name!=='' && this.tourForm.value.description!==''&& this.tourForm.value.difficulty!=='')
    {
      console.log(this.tourForm.value.tags);
    const tour: Tour = {
      name: this.tourForm.value.name || "",
      description: this.tourForm.value.description || "",
      difficulty: this.tourForm.value.difficulty || "",
      tags: this.tourForm.value.tags || [],
      status: 0,
      price: 0,
      userId: this.user.id,
      lengthInKm: 0,
      publishedTime: undefined,
      archiveTime: undefined,
      equipmentIds: [],
      keyPointIds: []
    };
    console.log(tour);
    this.service.addTour(tour).subscribe({
      next: () => { this.tourUpdated.emit();
        this.router.navigate(['/author-tours']);
       }
    });
  } }
  onTagChange(event: MatCheckboxChange, index: number): void {
    const currentTags: number[] = this.tourForm.get('tags')?.value || [];

    if (event.checked) {
      currentTags.push(index);
    } else {

      const tagIndex = currentTags.indexOf(index);
      if (tagIndex >= 0) {
        currentTags.splice(tagIndex, 1);
      }
    }
    this.tourForm.get('tags')?.setValue(currentTags);
    console.log(currentTags);
  }
}