import { Component, Inject, Input } from '@angular/core';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { EncounterServiceService } from '../encounter.service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Encounter, EncounterStatus, EncounterType, HiddenLocationDataDto, MiscDataDto, SocialDataDto } from '../model/encounter.model';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-author-encounter',
  templateUrl: './author-encounter.component.html',
  styleUrls: ['./author-encounter.component.css']
})
export class AuthorEncounterComponent {

  imageBase64: string = ''

  encounter: Encounter = {
    id: 0,
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    xp: 0,
    status: EncounterStatus.Draft,
    type: EncounterType.Social,
    socialData: null,  
    hiddenLocationData: null, 
    miscData: null  
  };

  social: SocialDataDto = {
    radius: 0,
    requiredParticipants: 0
  }
  hiddenLocation: HiddenLocationDataDto = {
    activationRadius: 0,
    imageUrl: '',
    imageBase64: '',
  }
  misc: MiscDataDto = {
    actionDescription: ''
  }
  selectedEncounterType: EncounterType = EncounterType.Social

  encounterTypes: string[] = Object.values(EncounterType)
  
  constructor(private service: EncounterServiceService,@Inject(MAT_DIALOG_DATA) public keyPoint: KeyPoint, private dialogRef: MatDialogRef<AuthorEncounterComponent>){
    this.encounter.latitude = this.keyPoint.latitude
    this.encounter.longitude = this.keyPoint.longitude
  }

  createEncounter(): void {
    if(this.encounter.type == EncounterType.Social){
      this.encounter.socialData = this.social
    }

    if(this.encounter.type == EncounterType.Misc){
      this.encounter.miscData = this.misc
    }

    if(this.encounter.type == EncounterType.HiddenLocation){
      this.encounter.hiddenLocationData = this.hiddenLocation
    }
    
    
    
    this.service.createEncounter(this.encounter).subscribe({
      next: () => {
          console.log("Encounter created: ", this.encounter)
      }
    })
    console.log("Encounter NOT created: ", this.encounter)
    this.closeDialog();
  }

  onEncounterTypeChange(): void {
    switch (this.selectedEncounterType) {
      case EncounterType.Social:

        this.encounter.socialData = this.social;
        this.encounter.hiddenLocationData = null;
        this.encounter.miscData = null;
        break;
      case EncounterType.HiddenLocation:
        
        this.encounter.hiddenLocationData = this.hiddenLocation;
        this.encounter.socialData = null;
        this.encounter.miscData = null;
        break;
      case EncounterType.Misc:
        
        this.encounter.miscData = this.misc;
        this.encounter.socialData = null;
        this.encounter.hiddenLocationData = null;
        break;
    }
  }

  onFileSelected(event: any){
    const file:File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
          this.hiddenLocation.imageBase64 = reader.result as string;
        
    };
    reader.readAsDataURL(file); 
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
