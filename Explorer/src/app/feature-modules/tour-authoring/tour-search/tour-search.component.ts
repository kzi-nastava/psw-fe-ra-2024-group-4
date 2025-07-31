import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourOverviewService } from '../tour-overview.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourOverview } from '../model/touroverview.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TourTags } from '../model/tour.tags.model';
import Swal from 'sweetalert2';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PurchaseService } from '../tour-purchase-token.service';
import { TourPurchaseToken } from '../../payments/model/tour-purchase-token.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PositionSimulator } from '../model/position-simulator.model';

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
  availableTags = ['Cycling',
    'Culture',
    'Adventure',
    'FamilyFriendly',
    'Nature',
    'CityTour',
    'Historical',
    'Relaxation',
    'Wildlife',
    'NightTour',
    'Beach',
    'Mountains',
    'Photography',
    'Guided',
    'SelfGuided']
  availableDiff =[ 'Easy', 'Medium', 'Hard']
  currentTags: string[] = [];
  resultingTours:TourOverview[] = []; 
  user: User;
  

  constructor(private service: TourOverviewService, private purchaseService: PurchaseService, private authService: AuthService){}
  ngOnInit(): void {
     this.authService.user$.subscribe(user => {
           this.user = user;
            console.log(user);
      });
     this.getAllTours();
  }

  getAllTours(): void {
    // Prvo dohvatite kupljene ture korisnika
        if (this.user) {
          this.purchaseService.getUserPurchasedTours(this.user.id).subscribe({
            next: (purchasedTokens: TourPurchaseToken[]) => {
              const purchasedTourIds = purchasedTokens.map(token => token.tourId);
              console.log(purchasedTokens);
      
              // Dohvatite sve ture
              this.service.getAllWithoutReviews().subscribe({
                next: (data: PagedResults<TourOverview>) => {
                  console.log('Tours loaded:', data);
      
                  // Filtrirajte ture koje korisnik nije kupio
                  this.resultingTours = data.results.filter(tour => !purchasedTourIds.includes(tour.tourId));
                  
                },
                error: (err) => {
                  console.error('Error loading tours:', err);
                }
              });
            },
            error: (err) => {
              console.error('Error fetching purchased tours:', err);
            }
          });
        } else {
          console.error('User not logged in. Cannot load tours.');
        }
  }

  tourSearchForm=new FormGroup({
    distance: new FormControl(0),
    name: new FormControl(''),
  })

  filterForm = new FormGroup({
    tags: new FormControl<string[]>([]),
    difficulty: new FormControl('')
});
  
  search(): void {
    const distanceValue = this.tourSearchForm.value.distance ?? 0;
    const nameValue = this.tourSearchForm.value.name?.toLowerCase() ?? '';
    
    

    if(distanceValue === 0 && nameValue === ''){
      Swal.fire({
        title: 'Warning!',
        text: "You haven't enterd any search parameters.",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    this.getAllTours();
    return;
    }

    if(distanceValue === 0){
      console.log('Usli u ime')
      this.service.getAllWithoutReviews().subscribe({
        next: (data: PagedResults<TourOverview>) => {
          let filteredResults = data.results;
          console.log('poziv servisu prosao')
          
          filteredResults = filteredResults.filter(tour =>
            tour.tourName.toLowerCase().includes(nameValue)
          );
          console.log(filteredResults)
          this.resultingTours = filteredResults;
          // Emitujemo rezultat pretrage
          this.tourSearchResults.emit(this.resultingTours);
          console.log(this.resultingTours);
        },
        error: (err) => {
          console.error('Error searching tours:', err);
        }
      });
      return;
    }

    if(nameValue === ''){
      this.service.getToursByKeyPointLocation(this.longitude, this.latitude, distanceValue).subscribe({
        next: (data: PagedResults<TourOverview>) => {
          this.resultingTours = data.results;
         
          this.tourSearchResults.emit(data.results);
          
        },
        error: (err) => {
          console.error('Error searching tours:', err);
        }
      });
      return;
    }

    
    
    this.service.getToursByKeyPointLocation(this.longitude, this.latitude, distanceValue).subscribe({
      next: (data: PagedResults<TourOverview>) => {
        let filteredResults = data.results;
            
            if (nameValue) {
                filteredResults = filteredResults.filter(tour =>
                    tour.tourName.toLowerCase().includes(nameValue)
                );
            }
        this.resultingTours = data.results;
        // Emitujemo rezultat pretrage
        this.tourSearchResults.emit(filteredResults);
        console.log(filteredResults);
      },
      error: (err) => {
        console.error('Error searching tours:', err);
      }
    });
  }

  filter(): void {
    const difficultyValue = this.filterForm.value.difficulty ?? '';
    const tags = this.currentTags ?? [];
    console.log(tags);

    if(difficultyValue === '' && this.currentTags.length === 0){
      Swal.fire({
        title: 'Warning!',
        text: "You haven't enterd any filter parameters.",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return
    }

    let filteredResults = this.resultingTours;
    if(difficultyValue === ''){
      console.log(1);
      filteredResults =  this.resultingTours.filter(tour => {
        return this.currentTags.every(tag => tour.tags.includes(tag));
      });
      this.tourSearchResults.emit(filteredResults);
      return;
    }

    if(this.currentTags.length === 0){
      console.log(2);
      filteredResults = this.resultingTours.filter(tour => tour.tourDifficulty === difficultyValue);
      this.tourSearchResults.emit(filteredResults);
      return;
    }

    console.log(this.currentTags);
    console.log(difficultyValue);

    filteredResults =  this.resultingTours.filter(tour => {
      return this.currentTags.every(tag => tour.tags.includes(tag));
    });
    filteredResults = filteredResults.filter(tour => tour.tourDifficulty === difficultyValue);
    this.tourSearchResults.emit(filteredResults);




  }


  onTagChange(event: MatCheckboxChange, tag: string): void {
    this.currentTags = this.filterForm.get('tags')?.value || [];

    if (event.checked) {
        // Dodaj tag u listu ako je checkbox selektovan
        this.currentTags.push(tag);
    } else {
        // Ukloni tag iz liste ako je checkbox poništen
        const tagIndex = this.currentTags.indexOf(tag);
        if (tagIndex >= 0) {
            this.currentTags.splice(tagIndex, 1);
        }
    }

    // Ažuriraj formu sa izmenjenom listom tagova
    this.filterForm.get('tags')?.setValue(this.currentTags);
    console.log(this.currentTags)
  }

  clearFilters(): void {
    this.tourSearchResults.emit(this.resultingTours);
    this.filterForm.reset();
  }

  clearSearch(): void {
    this.getAllTours()
    this.tourSearchForm.reset();
    this.filterForm.reset();
  }
  

  setLongitude(newLongitude: number): void{
    this.longitude=newLongitude;
    

  }

  setLatitude(newLatitude: number): void{  
    this.latitude = newLatitude;
  }

}
