import { Component, OnInit } from '@angular/core';
import { Encounter, EncounterStatus, EncounterType, SocialDataDto, HiddenLocationDataDto, MiscDataDto} from '../model/encounter.model';
import { EncounterServiceService } from '../encounter.service.service';
import { interval } from 'rxjs';

@Component({
  selector: 'xp-admin-encounter',
  templateUrl: './admin-encounter.component.html',
  styleUrls: ['./admin-encounter.component.css']
})
export class AdminEncounterComponent implements OnInit {

  constructor(private encounterService: EncounterServiceService) {}

  encounterTypes: string[] = Object.values(EncounterType);  // Dynamically fetch the encounter types
  selectedEncounterType: string = EncounterType.Social;  // Default type

  social: { requiredParticipants: 0, radius: 0 } = { requiredParticipants: 0, radius: 0 };  // Default values
  hiddenLocation: { imageUrl: '', activationRadius: 0 , imageBase64: ''} = { imageUrl: '', activationRadius: 0, imageBase64: ''}; // Default values
  misc: { actionDescription: '' } = { actionDescription: '' };  // Default values  

  encounter: Encounter = {
    id: 0,
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    xp: 0,
    status: EncounterStatus.Draft,
    type: EncounterType.Social,
    socialData: null,  // Default values
    hiddenLocationData: null, // Default values
    miscData: null  // Default values
  };

  // Event handler for latitude change
  onLatitudeChanged(lat: number): void {
    this.encounter.latitude = lat;
    console.log('Latitude changed:', this.encounter.latitude);
  }

  // Event handler for longitude change
  onLongitudeChanged(lng: number): void {
    this.encounter.longitude = lng;
    console.log('Longitude changed:', this.encounter.longitude);
  }

  encounters: Encounter[] = [];

  ngOnInit() {
    // Initialize encounter and load any existing encounter data if needed
    //this.encounterService.getInRadius(1, 45.2671, 19.8335).subscribe({
    //ovaj deo iznad je zakomentarisan jer mislim da nije prakticno da se prikazuju samo izazovi na 1km od centra NS
    //i ovo ispod je malo bzv, mislim da bi trebalo da imamo na backu dobavljanje svih encountera bez radijusa i lat i long
    //ali nije moj posao pa nisam ispravljala
      const globalRadius = 20000; // 20.000 km pokriva celu planetu
      this.encounterService.getInRadius(globalRadius, 0, 0).subscribe({
      next: ((data) => {
        console.log("Odgovor sa servera:", data);
        console.log("Uspesno uzete na pocetku");
        this.encounters = data.results;
        console.log("Encounters prosleđeni u xp-map:", this.encounters);
      }),
      error: (err) => {
        console.error('Error loading tours:', err);
      }
    });
  }

  onEncounterTypeChange() {
    // Reset the encounter data based on the selected type
    switch (this.selectedEncounterType) {
      case EncounterType.Social:
        // Ensure socialData is always initialized
        this.encounter.socialData = this.social;
        this.encounter.hiddenLocationData = null;
        this.encounter.miscData = null;
        break;
      case EncounterType.HiddenLocation:
        // Ensure hiddenLocationData is always initialized
        this.encounter.hiddenLocationData = this.hiddenLocation;
        this.encounter.socialData = null;
        this.encounter.miscData = null;
        break;
      case EncounterType.Misc:
        // Ensure miscData is always initialized
        this.encounter.miscData = this.misc;
        this.encounter.socialData = null;
        this.encounter.hiddenLocationData = null;
        break;
    }
  }

  onSubmit() {
    // Handle form submission
    console.log('New encounter submitted:', this.encounter);

    // After submitting, reset the form
    this.encounter = {
      id: 0,
      title: '',
      description: '',
      latitude: 0,
      longitude: 0,
      xp: 0,
      status: EncounterStatus.Draft,
      type: EncounterType.Social,
      socialData: { requiredParticipants: 0, radius: 0 },
      hiddenLocationData: { imageUrl: '', activationRadius: 0 , imageBase64: ''},
      miscData: { actionDescription: '' }
    };
  }

  onMapClick(event: any) {
    // Update the form with the clicked map coordinates
    this.encounter.longitude = event.longitude;
    this.encounter.latitude = event.latitude;
  }
}