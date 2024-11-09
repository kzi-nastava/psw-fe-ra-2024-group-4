import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourOverview } from '../model/touroverview.model';

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

  constructor(private servis: TourOverviewService){}

  tourSearchForm=new FormGroup({
    distance: new FormControl(0, [Validators.required])
  })
  
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
  

  setLongitude(newLongitude: number): void{
    this.longitude=newLongitude;
    alert(this.longitude);
    

  }

  setLatitude(newLatitude: number): void{
  
    this.latitude = newLatitude;
  }

}
