import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourOverview } from '../model/touroverview.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TourTags } from '../model/tour.tags.model';

@Component({
  selector: 'xp-tour-search',
  templateUrl: './tour-search.component.html',
  styleUrls: ['./tour-search.component.css']
})
export class TourSearchComponent {

  @Output() tourSearchResults = new EventEmitter<TourOverview[]>();
  latitude: number = 41.8992;
  longitude: number = 12.4798;

  tourSearchActivated: boolean = true;
  availableTags = Object.keys(TourTags)
  .filter(key => isNaN(Number(key)))
  .map((tag, index) => ({ index, label: tag }));
  availableCountries: string[] = ['Serbia', 'Croatia'];
  availableCities: string[] = ['Belgrade', 'Novi Sad'];
  availableDiff =[ 0, 1, 2]
  currentTags: number[] = [];
  

  constructor(private servis: TourOverviewService){}

  tourSearchForm=new FormGroup({
    distance: new FormControl(0, [Validators.required])
  })

  tourSearchForm1 = new FormGroup({
    name: new FormControl('', [Validators.required]),
    city: new FormControl(''),
    country: new FormControl(''),
    tags: new FormControl<number[]>([]),
    distance: new FormControl(0, [Validators.required]),
    difficulty: new FormControl(0, [Validators.required])
});
  
  search(): void {
    const distanceValue = this.tourSearchForm.value.distance ?? 0;
    
    this.servis.getToursByKeyPointLocation(this.longitude, this.latitude, distanceValue).subscribe({
      next: (data: PagedResults<TourOverview>) => {
        // Emitujemo rezultat pretrage
        this.tourSearchResults.emit(data.results);
        console.log(data.results);
      },
      error: (err) => {
        console.error('Error searching tours:', err);
      }
    });
  }


  onTagChange(event: MatCheckboxChange, index: number): void {
    this.currentTags = this.tourSearchForm1.get('tags')?.value || [];

    if (event.checked) {
      this.currentTags.push(index);
    } else {

      const tagIndex = this.currentTags.indexOf(index);
      if (tagIndex >= 0) {
        this.currentTags.splice(tagIndex, 1);
      }
    }
    this.tourSearchForm1.get('tags')?.setValue(this.currentTags);

  }
  

  setLongitude(newLongitude: number): void{
    this.longitude=newLongitude;
    

  }

  setLatitude(newLatitude: number): void{
  
    this.latitude = newLatitude;
  }

}
