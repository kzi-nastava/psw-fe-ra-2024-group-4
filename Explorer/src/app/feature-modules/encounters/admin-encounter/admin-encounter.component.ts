import { Component, inject, Input, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
import { Encounter, EncounterStatus, EncounterType, SocialDataDto, HiddenLocationDataDto, MiscDataDto, RequestStatus} from '../model/encounter.model';
import { EncounterServiceService } from '../encounter.service.service';
import { concat, interval } from 'rxjs';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { MatDialog } from '@angular/material/dialog';
import { HiddenMap } from '../hidden-map/hidden-map.component';

@Component({
  selector: 'xp-admin-encounter',
  templateUrl: './admin-encounter.component.html',
  styleUrls: ['./admin-encounter.component.css']
})
export class AdminEncounterComponent implements OnInit {
  @Input() labelPosition: 'before' | 'after' = 'before';


  isChatOpen: boolean = false; 
  chatMessage: string = 'Create a new encounter by selecting the type, adding a title, description, and setting up additional details. Depending on the encounter type, you can specify participants, activation radius, or even select a hidden location on the map. Once you fill in the necessary fields, click "Create Encounter" to publish it!';
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  constructor(private encounterService: EncounterServiceService, private authService: AuthService) {}

  isChosingSecretLocation = false;

  user: User;
  encounterTypes: string[] = ["Social", "HiddenLocation", "Misc"]  // Dynamically fetch the encounter types
  selectedEncounterType: string = "Social";  // Default type

  social: SocialDataDto = { requiredParticipants: 0, radius: 0 };  // Default values
  hiddenLocation: HiddenLocationDataDto = { imageUrl: '', activationRadius: 0, imageBase64: '', latitude: 0, longitude: 0}; // Default values
  misc: MiscDataDto = { actionDescription: '' };  // Default values  

  encounter: Encounter = {
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    xp: 0,
    status: EncounterStatus.Draft,
    type: EncounterType.Social,
    requestStatus: RequestStatus.Public,
    socialData: null,  // Default values
    hiddenLocationData: null, // Default values
    miscData: null,  // Default values
    instances: [],
    isRequired: false
  };

  readonly dialog = inject(MatDialog);
  readonly hiddenLat = signal(0);
  readonly hiddenLon = signal(0);
  
  address: string = "No address selected";

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
    this.authService.user$.subscribe((user: User) => {
      this.user = user;
    })
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
        this.encounter.type = 0;
        this.encounter.socialData = this.social;
        this.encounter.hiddenLocationData = null;
        this.encounter.miscData = null;
        this.isChosingSecretLocation = false;
        break;
      case "HiddenLocation":
        // Ensure hiddenLocationData is always initialized
        this.encounter.type = 1;
        this.encounter.hiddenLocationData = this.hiddenLocation;
        this.encounter.socialData = null;
        this.encounter.miscData = null;
        this.isChosingSecretLocation = false;
        break;
      case "Misc":
        // Ensure miscData is always initialized
        this.encounter.type = 2;
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
    if(this.user.role === 'tourist'){
      this.encounter.requestStatus = RequestStatus.Pending;
    }
    else{
      this.encounter.requestStatus = RequestStatus.Public;
    }
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
      requestStatus: RequestStatus.Public,
      socialData: { requiredParticipants: 0, radius: 0 },
      hiddenLocationData: { imageUrl: '', activationRadius: 0 , imageBase64: '', latitude: 0, longitude: 0},
      miscData: { actionDescription: '' },
      isRequired: false
    };


    const globalRadius = 20000; // 20.000 km pokriva celu planetu
      this.encounterService.getInRadius(globalRadius, 0, 0).subscribe({
      next: ((data) => {
        console.log("Odgovor sa servera:", data);
        console.log("Uspesno uzete na pocetku");
        this.encounters = data.results;
        console.log("Encounters prosleđeni u xp-map:", this.encounters);
        location.reload();
      }),
      error: (err) => {
        console.error('Error loading tours:', err);
      }
      });
  }

  onMapClick(event: any) {
    // Update the form with the clicked map coordinates
    this.encounter.longitude = event.longitude;
    this.encounter.latitude = event.latitude;
  }

  openHiddenLocationMap() {
    const hiddenMapDialog = this.dialog.open(HiddenMap, {
      width: '80%',
      height: '80%',
      data: {
        latitude: this.hiddenLocation.latitude,
        longitude: this.hiddenLocation.longitude,
        address: this.address
      }
    });
  
    hiddenMapDialog.afterClosed().subscribe(result => {
      if (result) {
        this.hiddenLocation.latitude = result.latitude;
        this.hiddenLocation.longitude = result.longitude;
        this.address = result.address;
      }
    });
  }
}