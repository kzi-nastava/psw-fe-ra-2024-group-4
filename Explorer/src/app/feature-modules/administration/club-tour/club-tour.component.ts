import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ClubTour } from '../model/club-tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourOverviewService } from '../../tour-authoring/tour-overview.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourOverview } from '../../tour-authoring/model/touroverview.model';
import { MatFormField } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectorRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
@Component({
  selector: 'xp-club-tour',
  templateUrl: './club-tour.component.html',
  styleUrls: ['./club-tour.component.css']
})
export class ClubTourComponent implements OnInit{
  @Input() clubId!: number;
  @Input() ownerId!: number;
  @Input() clubTags!: number[] | 0;
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;
  @ViewChild('datepickerInput') datepickerInput: MatInput;
  isOwner: boolean = false;
  user: User | null = null;
  clubTours: ClubTour[] = [];
  allClubTours: ClubTour[] = [];
  clubTour: ClubTour = {
    clubId: 0,            // Postavite podrazumevane vrednosti
    tourId: 0,            // Postavite podrazumevane vrednosti
    date: new Date(),     // Postavite podrazumevanu vrednost za datum (danasnji datum)
    discount: 0,          // Postavite podrazumevanu vrednost za popust
    touristIds: [],       // Postavite prazan niz za IDs turista
  };
  minDate: Date = new Date();
  selectedDate: Date | null = null;
  selectedDiscount: number = 5;
  isSubmitted: boolean = false;
  dateError:boolean = true;

  shouldDisplayForm: boolean = false;
  shouldDisplayFilters: boolean = false;
  selectedTour: any = null;
  shouldDisplaySmartTags = false;

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

  //forme
  tourSearchForm=new FormGroup({
    name: new FormControl('')
  });

  filterForm = new FormGroup({
    tags: new FormControl<string[]>([]),
    difficulty: new FormControl('')
  });
  //filteri
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
  availableDiff =[ 'Easy', 'Moderate', 'Hard']
  smartTags = ['Recent', 'Club Favorites']
  currentTags: string[] = [];

  tours: TourOverview[] = []; // sve
  displayedTours:TourOverview[] = []; //za display nakon search i filtera


  constructor(private service: AdministrationService, private authService: AuthService, private tourOverviewService: TourOverviewService, private cdr: ChangeDetectorRef){}

  ngOnInit(){
    console.log(this.clubId);
    this.getUser();
    this.getClubTours();
    this.getTours();
  }


  
  getUser(): void{
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      //console.log('PROVERA');
      console.log(user);
      //this.userId = user.id;
      if(user.id === this.ownerId){
        this.isOwner = true;
      }
    });
  }

  getClubTours(): void{
    this.service.getAllClubTours().subscribe({
      next: (result: PagedResults<ClubTour>) =>{
        this.clubTours = result.results.filter(clubTour => clubTour.clubId === this.clubId);
        this.allClubTours = result.results.filter(clubTour => clubTour.clubId === this.clubId); //za recent jer mozda clubTours postane samo ture koje nisu prosle vec
        this.getToursInfo();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  getToursInfo(): void{
    this.clubTours.forEach((clubTour) => {
      if (clubTour.tourId) {
        this.tourOverviewService.getById(clubTour.tourId).subscribe({
          next: (tour) => {
            clubTour.title = tour.tourName;
            clubTour.description = tour.tourDescription;
            clubTour.price = tour.price;
            clubTour.difficulty = tour.tourDifficulty;
            clubTour.tags = tour.tags;
            //clubTour.lengthInKm 
          },
          error: (err) => {
           // console.error(Error fetching tour details for tourId: ${clubTour.tourId}, err);
          }
        });
      } else {
        //console.warn(ClubTour with missing tourId:, clubTour);
      }
    });
  }
  getTagNumber(word: string): number { //daj broj od tada
    for (const [key, value] of Object.entries(this.tourTagMap)) {
      if (value === word) {
        return +key; // Convert the key back to a number
      }
    }
    return -1; // Return -1 or any default value if the word is not found
  }
  getTours(): void{
    this.tourOverviewService.getAllWithoutReviews().subscribe({
      next: (result) => {
        this.tours = result.results; 
        this.displayedTours = result.results;
      },
      error: (err) => {
        console.error('Error fetching tours:', err);
        //this.error = 'Failed to fetch tours. Please try again later.';
      }
    });
  }
  closeForm(){
    this.shouldDisplayForm = false;
    this.selectedTour = null;
    this.selectedDate = null;
    this.selectedDiscount = 5;
    this.filterForm.reset();
  }
  displayForm(){
    this.shouldDisplayForm = true;
    this.shouldDisplayFilters = false;
    this.cdr.detectChanges();
    this.currentTags = [];
    this.getTours();
  }
  toggleFilters(){
    this.shouldDisplayFilters = !this.shouldDisplayFilters;
    console.log('click');
  }
  closeFilters(){
    this.shouldDisplayFilters = false;
  }
  openFilters(){
    this.shouldDisplayFilters = true;
  }
  selectTour(tour: any): void {
    this.selectedTour = tour;
    console.log('Selektovana tura:', this.selectedTour);
  }







  //search i filteri 
  search(sentTours = this.tours): void {
    const nameValue = this.tourSearchForm.value.name?.toLowerCase() ?? '';


      this.displayedTours = sentTours.filter(tour =>
        tour.tourName.toLowerCase().includes(nameValue)
        
      );
     // console.log('ima tagova');
    this.selectedTour = null;

  }

  filter(): void {
    const difficultyValue = this.filterForm.value.difficulty ?? '';
    const tags = this.currentTags ?? [];
    if(this.currentTags.some(tag => tag === "Recent" || tag ==="Club Favorites")){
      this.smartFilter();
      //this.search();
      return;
    }

    console.log('tags:', tags);
    this.selectedTour = null;
    if(difficultyValue === '' && this.currentTags.length === 0){
      Swal.fire({
        title: 'Warning!',
        text: "You haven't enterd any filter parameters.",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      this.search(this.tours);
      return
    }

    if(difficultyValue === ''){
      console.log(1);
      this.displayedTours =  this.tours.filter(tour => {
        return this.currentTags.every(tag => tour.tags.includes(tag));
      });
      //this.search(this.displayedTours);
      return;
    }

    if(this.currentTags.length === 0){
      console.log(2);
      this.displayedTours = this.tours.filter(tour => tour.tourDifficulty === difficultyValue);
      return;
    }

    console.log(this.currentTags);
    console.log(difficultyValue);

    this.displayedTours =  this.tours.filter(tour => {
      return this.currentTags.every(tag => tour.tags.includes(tag));
    });
    this.displayedTours = this.displayedTours.filter(tour => tour.tourDifficulty === difficultyValue);
    //this.search(this.displayedTours);
  }

  smartFilter(): void{
    const difficultyValue = this.filterForm.value.difficulty ?? '';
    console.log("recent filter");
    if(this.currentTags.some(tag => tag ==="Recent")){
      const tourIds: number[] = []; 
      this.allClubTours.forEach(tour => {
        if (!tourIds.includes(tour.tourId)) {
          tourIds.push(tour.tourId); 
        }
      });
      this.displayedTours = this.tours.filter(tour=> tourIds.includes(tour.tourId));
      if(difficultyValue !== ''){
        this.displayedTours = this.displayedTours.filter(tour => tour.tourDifficulty === difficultyValue);

      }
    } 
    console.log(this.clubTags);

    if(this.currentTags.some(tag => tag === "Club Favorites") && Array.isArray(this.clubTags)){
      const tags = this.clubTags.map(tagId => this.tourTagMap[tagId]).filter(tag => tag !== undefined);
      console.log('cf');
      if(!this.currentTags.some(tag => tag ==="Recent")){
        this.displayedTours = this.tours;
      }
      if(difficultyValue === ''){
        this.displayedTours =  this.displayedTours.filter(tour => {
          return tags.some(tag => tour.tags.includes(tag));
        });
        this.search(this.displayedTours);
        return;
      }
      this.displayedTours =  this.tours.filter(tour => {
        return tags.every(tag => tour.tags.includes(tag));
      });
      this.displayedTours = this.displayedTours.filter(tour => tour.tourDifficulty === difficultyValue);
      //this.search(this.displayedTours);
    
      
    
    }
    
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
    this.getTours();
    this.filterForm.reset();
  }

  clearSearch(): void {
    this.getTours()
    this.tourSearchForm.reset();
    this.filterForm.reset();
  }
  displayAllTags(): void{
    this.shouldDisplaySmartTags = false;
    this.clearFilters();
    this.currentTags = [];
  }
  displaySmartTags(): void{
    this.shouldDisplaySmartTags = true;
    this.clearFilters();
    this.currentTags = [];
  }

  organizeClubTour(): void{
    //console.log(this.selectedTour.tourName);
    this.isSubmitted = true;
    //this.cdr.detectChanges();
    //this.datepickerInput.focused = true;
    console.log(this.selectedDate);
    if(this.selectedTour === null){
      Swal.fire({
        title: 'Warning!',
        text: "You haven't selected a tour.",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      //this.search(this.tours);
      return
    }
    console.log(this.clubId);
    // if(this.selectedDate){
    //   this.clubTour.id = 0;
    //   this.clubTour.clubId = this.clubId;
    //   this.clubTour.tourId = this.selectedTour.tourId;
    //   this.clubTour.date = this.selectedDate;
    //   this.clubTour.discount = this.selectedDiscount;
    //   this.clubTour.touristIds = [];
    // }


  }
  onSubmit(form: NgForm) {
    this.isSubmitted = true;
    if (form.invalid) {
      // Ako forma nije validna, označite polje kao "touched"
      form.control.markAllAsTouched();
    }
    if(this.selectedTour === null){
      Swal.fire({
        title: 'Warning!',
        text: "You haven't selected a tour.",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      //this.search(this.tours);
      return
    }
    console.log(this.selectedTour.tourName);
    console.log(this.clubTour);
    if(this.selectedDate && this.selectedDiscount <= 100 && this.selectedDiscount>=5){
      console.log('xdd');
      console.log('clubid',this.clubId);
      this.clubTour.clubId = this.clubId;
      this.clubTour.tourId = this.selectedTour.tourId;
      this.clubTour.date = this.selectedDate;
      this.clubTour.discount = this.selectedDiscount;
      this.clubTour.touristIds = [];
      this.service.addClubTour(this.clubTour).subscribe(
        (response) => {
          console.log('Tour added successfully!', response);
          // Možete da uradite nešto sa odgovorom, npr. redirekcija ili obaveštenje korisniku
          this.getClubTours();
        },
        (error) => {
          console.error('There was an error adding the tour!', error);
          // Obrada greške, obavestiti korisnika
        }
      );
    }
    console.log(this.clubTour);
    
  }
}

