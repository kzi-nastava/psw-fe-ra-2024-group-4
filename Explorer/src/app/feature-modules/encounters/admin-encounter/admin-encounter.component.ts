import { Component, OnInit } from '@angular/core';
import { Encounter, EncounterStatus, EncounterType, SocialDataDto, HiddenLocationDataDto, MiscDataDto} from '../model/encounter.model';

@Component({
  selector: 'xp-admin-encounter',
  templateUrl: './admin-encounter.component.html',
  styleUrls: ['./admin-encounter.component.css']
})
export class AdminEncounterComponent implements OnInit {

  encounterTypes: string[] = Object.values(EncounterType);  // Dynamically fetch the encounter types
  selectedEncounterType: string = EncounterType.Social;  // Default type

  encounter: Encounter = {
    id: 0,
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    xp: 0,
    status: EncounterStatus.Draft,
    type: EncounterType.Social,
    data: null,
    socialData: { requiredParticipants: 0, radius: 0 },  // Default values
    hiddenLocationData: { imageUrl: '', activationRadius: 0 }, // Default values
    miscData: { actionDescription: '' }  // Default values
  };

  encounters: Encounter[] = [];

  ngOnInit() {
    // Initialize encounter and load any existing encounter data if needed
  }

  onEncounterTypeChange() {
    // Reset the encounter data based on the selected type
    switch (this.selectedEncounterType) {
      case EncounterType.Social:
        // Ensure socialData is always initialized
        this.encounter.socialData = { requiredParticipants: 0, radius: 0 };
        this.encounter.hiddenLocationData = { imageUrl: '', activationRadius: 0 };
        this.encounter.miscData = { actionDescription: '' };
        break;
      case EncounterType.HiddenLocation:
        // Ensure hiddenLocationData is always initialized
        this.encounter.hiddenLocationData = { imageUrl: '', activationRadius: 0 };
        this.encounter.socialData = { requiredParticipants: 0, radius: 0 };
        this.encounter.miscData = { actionDescription: '' };
        break;
      case EncounterType.Misc:
        // Ensure miscData is always initialized
        this.encounter.miscData = { actionDescription: '' };
        this.encounter.socialData = { requiredParticipants: 0, radius: 0 };
        this.encounter.hiddenLocationData = { imageUrl: '', activationRadius: 0 };
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
      data: null,
      socialData: { requiredParticipants: 0, radius: 0 },
      hiddenLocationData: { imageUrl: '', activationRadius: 0 },
      miscData: { actionDescription: '' }
    };
  }

  onMapClick(event: any) {
    // Update the form with the clicked map coordinates
    this.encounter.longitude = event.longitude;
    this.encounter.latitude = event.latitude;
  }
}