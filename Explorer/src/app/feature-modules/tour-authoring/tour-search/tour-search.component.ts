import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourOverview } from '../model/touroverview.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TourTags } from '../model/tour.tags.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-tour-search',
  templateUrl: './tour-search.component.html',
  styleUrls: ['./tour-search.component.css']
})
export class TourSearchComponent implements OnInit {

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
  ngOnInit(): void {
     this.getAllTours();
  }

  getAllTours(): void {
    this.servis.getAllWithoutReviews().subscribe({
      next: (data: PagedResults<TourOverview>) => {
        this.tourSearchResults.emit(data.results);
        console.log(data.results);
      },
      error: (err) => {
        console.error('Error searching tours:', err);
      }
    });
  }

  tourSearchForm=new FormGroup({
    distance: new FormControl(0),
    name: new FormControl(''),
  })

  filterForm = new FormGroup({
    tags: new FormControl<number[]>([]),
    difficulty: new FormControl(0)
});
  
  search(): void {
    const distanceValue = this.tourSearchForm.value.distance ?? 0;
    const nameValue = this.tourSearchForm.value.name ?? '';

    if(distanceValue === 0 && nameValue === ''){
      Swal.fire({
        title: 'Warning!',
        text: 'You must enter at least one search parameter!',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
    this.getAllTours();
    return;
    }

    if(distanceValue === 0){
      this.servis.getAllWithoutReviews().subscribe({
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
    
    this.servis.getToursByKeyPointLocation(this.longitude, this.latitude, distanceValue).subscribe({
      next: (data: PagedResults<TourOverview>) => {
        let filteredResults = data.results;

            if (nameValue) {
                filteredResults = filteredResults.filter(tour =>
                    tour.tourName.toLowerCase().includes(nameValue)
                );
            }
        // Emitujemo rezultat pretrage
        this.tourSearchResults.emit(filteredResults);
        console.log(filteredResults);
      },
      error: (err) => {
        console.error('Error searching tours:', err);
      }
    });
  }


  onTagChange(event: MatCheckboxChange, index: number): void {
    this.currentTags = this.filterForm.get('tags')?.value || [];

    if (event.checked) {
      this.currentTags.push(index);
    } else {

      const tagIndex = this.currentTags.indexOf(index);
      if (tagIndex >= 0) {
        this.currentTags.splice(tagIndex, 1);
      }
    }
    this.filterForm.get('tags')?.setValue(this.currentTags);

  }
  

  setLongitude(newLongitude: number): void{
    this.longitude=newLongitude;
    

  }

  setLatitude(newLatitude: number): void{  
    this.latitude = newLatitude;
  }

}
