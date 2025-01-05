import { Component, OnInit } from '@angular/core';
import { TourService } from '../tour.service';
import { AdministrationService } from '../../administration/administration.service';
import { TourPreferenceService } from '../tour-preference.service';
import { Tour } from '../model/tour.model';
import { Club } from '../../administration/model/club.model';
import { TourPreference } from 'src/app/shared/model/tour-preference.model';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { trigger, style, animate, keyframes, transition } from '@angular/animations';


@Component({
  selector: 'xp-addvertisement',
  templateUrl: './addvertisement.component.html',
  styleUrls: ['./addvertisement.component.css'],
  animations: [
    trigger('pulse', [
      transition('* => *', [
        animate('1s ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }), // Početna veličina
          style({ transform: 'scale(1.1)', offset: 0.5 }), // Povećanje na pola trajanja
          style({ transform: 'scale(1)', offset: 1 }) // Vraćanje na početnu veličinu
        ]))
      ])
    ])
  ]
})
export class AddvertisementComponent implements OnInit{

  tours: Tour[] | null
  clubs: Club[] | null

  matchingTours: Tour[] | null
  matchingClubs: Club[] | null

  touristPreference: TourPreference | null

  tourAd: Tour | null
  clubAd: Club | null

  constructor(private tourService: TourService, 
              private clubService: AdministrationService, 
              private tourPreferenceService: TourPreferenceService){}

  ngOnInit(): void{

    this.tourService.getAllTours().subscribe({
      next: (tours: Tour[]) => {
        this.tours = tours;
        console.log('shshsh')
        this.tourPreferenceService.getTourPreference().subscribe({
          next: (preference: TourPreference | null) => {
            if (preference) {
              this.touristPreference = preference; 
              console.log('Tourist preference retrieved:', preference);
            } else {
              console.warn('No tour preference found for the current user.');
            }
          },
          error: (err) => {
            console.error('Error retrieving tour preference:', err);
          }
        });
    
        this.findMatchingTours()
      },
      error: (err: any) => {
        console.error('Error retrieving tours: ', err);
      }
    });

    this.clubService.getAllClubs().subscribe({
      next: (pagedResults: PagedResults<Club>) => {
        this.clubs = pagedResults.results; 
      },
      error: (err: any) => {
        console.error('Error retrieving clubs: ', err)
      }
    });

    
    this.findMatchingClubs()
  }

  findMatchingTours(): void {

    if(this.tours){
      this.matchingTours = this.tours;
  
      if(this.touristPreference){
        const preferenceTags = this.touristPreference.tags;
  
      this.matchingTours = this.tours.filter(tour =>
        tour.tags.some(tag => preferenceTags.includes(tag))
      );
      }

      console.log('Matching Tours:', this.matchingTours);

      
      this.tourAd = this.matchingTours 
        ? this.matchingTours[Math.floor(Math.random() * this.matchingTours.length)] 
        : null;
  
      console.log(this.tourAd)
      console.log('rekl')
    }
    
  }

  findMatchingClubs(): void {

    if (!this.touristPreference?.tags || !this.clubs) {
      this.matchingClubs = this.clubs
      return;
    }

    const preferenceTags = this.touristPreference.tags;

    this.matchingClubs = this.clubs.filter(club =>
      club.tags.some(tag => preferenceTags.includes(tag))
    );

    this.clubAd = this.matchingClubs.length > 0 
      ? this.matchingClubs[Math.floor(Math.random() * this.matchingClubs.length)] 
      : null;

    console.log('Matching Clubs:', this.matchingClubs);
  }

  closeAdvertisement() {
    const card = document.querySelector('.advertisement-card') as HTMLElement;
    if (card) {
      card.style.display = 'none';
    }
  }


}