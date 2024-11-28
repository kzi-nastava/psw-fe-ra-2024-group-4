import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Encounter, EncounterStatus, EncounterType, SocialDataDto, HiddenLocationDataDto, MiscDataDto} from '../model/encounter.model';
import { EncounterServiceService } from '../encounter.service.service';
import { concat, interval } from 'rxjs';

@Component({
  selector: 'xp-admin-encounter',
  templateUrl: './admin-encounter.component.html',
  styleUrls: ['./admin-encounter.component.css']
})
export class AdminEncounterComponent implements OnInit {

  constructor(private encounterService: EncounterServiceService) {}

  isChosingSecretLocation = false;

  encounterTypes: string[] = ["Social", "HiddenLocation", "Misc"]  // Dynamically fetch the encounter types
  selectedEncounterType: string = "Social";  // Default type

  social: { requiredParticipants: 0, radius: 0 } = { requiredParticipants: 0, radius: 0 };  // Default values
  hiddenLocation: { imageUrl: '', activationRadius: 0 , imageBase64: '', latitude: number, longitude: number} = { imageUrl: '', activationRadius: 0, imageBase64: '', latitude: 0, longitude: 0}; // Default values
  misc: { actionDescription: '' } = { actionDescription: '' };  // Default values  

  encounter: Encounter = {
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    xp: 0,
    status: EncounterStatus.Draft,
    type: EncounterType.Social,
    socialData: null,  // Default values
    hiddenLocationData: null, // Default values
    miscData: null,  // Default values
    instances: [],
    data: ""
  };

  // Event handler for latitude change
  onLatitudeChanged(lat: number): void {
    if(this.isChosingSecretLocation) {
      this.hiddenLocation.latitude = lat;
      return;
    } 
    this.encounter.latitude = lat;
    console.log('Latitude changed:', this.encounter.latitude);
  }

  // Event handler for longitude change
  onLongitudeChanged(lng: number): void {
    if(this.isChosingSecretLocation) {
      this.hiddenLocation.longitude = lng;
      return;
    } 
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
      case "Social":
        // Ensure socialData is always initialized
        this.encounter.socialData = this.social;
        this.encounter.hiddenLocationData = null;
        this.encounter.miscData = null;
        this.isChosingSecretLocation = false;
        break;
      case "HiddenLocation":
        // Ensure hiddenLocationData is always initialized
        this.encounter.hiddenLocationData = this.hiddenLocation;
        this.encounter.socialData = null;
        this.encounter.miscData = null;
        this.isChosingSecretLocation = false;
        break;
      case "Misc":
        // Ensure miscData is always initialized
        this.encounter.miscData = this.misc;
        this.encounter.socialData = null;
        this.encounter.hiddenLocationData = null;
        this.isChosingSecretLocation = false;
        break;
    }
  }

  onSubmit() {
    // Handle form submission
    console.log('New encounter submitted:', this.encounter);

    switch(this.encounter.type) {
      case 0: 
        this.encounter.type = 0;
        this.encounter.socialData = this.social;
        this.encounter.hiddenLocationData = null;
        this.encounter.miscData = null;
        this.isChosingSecretLocation = false;
        break;
      case 1: 
        this.encounter.type = 1;
        this.encounter.socialData = null;
        this.encounter.hiddenLocationData = this.hiddenLocation;
        this.encounter.miscData = null;
        this.isChosingSecretLocation = false;
        break;
      case 2: 
        this.encounter.type = 2;
        this.encounter.socialData = null;
        this.encounter.hiddenLocationData = null;
        this.encounter.miscData = this.misc;
        this.isChosingSecretLocation = false;
        break;
    }

    this.encounter.status = 0;
    console.log("NNNNNNNNNNNNNN");
    console.log(this.encounter);
    // After submitting, reset the form
    this.encounterService.createEncounter(this.encounter).subscribe({
      next: ((data) => {
        console.log("MMMMMMMMMMMMMM");
        console.log(data);
        // this.encounters.push(data)
      }),
      error: ((error) => {
        console.log(error);
      })
    });

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
      hiddenLocationData: { imageUrl: '', activationRadius: 0 , imageBase64: '', latitude: 0, longitude: 0},
      miscData: { actionDescription: '' }
    };


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

  onMapClick(event: any) {
    // Update the form with the clicked map coordinates
    if (this.isChosingSecretLocation) {
      this.hiddenLocation.longitude = event.longitude;
      this.hiddenLocation.latitude = event.latitude;
      return;
    }
    this.encounter.longitude = event.longitude;
    this.encounter.latitude = event.latitude;
  }
}