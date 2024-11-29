import { Component, Inject, Input } from '@angular/core';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { EncounterServiceService } from '../encounter.service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Encounter, EncounterStatus, EncounterType, HiddenLocationDataDto, MiscDataDto, RequestStatus, SocialDataDto } from '../model/encounter.model';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

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
    status: EncounterStatus.Archived,
    type: EncounterType.Social,
    requestStatus: RequestStatus.Public,
    socialData: null,  
    hiddenLocationData: null, 
    miscData: null,
    instances: null
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

  user: User;
  selectedEncounterType: string = "Social"

  encounterTypes: string[] = ["Social", "HiddenLocation", "Misc"]
  
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
      }, error: (err) =>{
        console.log(err)
        console.log("Encounter NOT created: ", this.encounter)
      }
    })
    this.closeDialog();
  }

  onEncounterTypeChange(): void {
    
    if (this.selectedEncounterType === 'Social') {
        this.encounter.socialData = this.social;
        this.encounter.type = 0;
        this.encounter.hiddenLocationData = null;
        this.encounter.miscData = null;
    }
     if (this.selectedEncounterType === 'HiddenLocation'){
      this.encounter.hiddenLocationData = this.hiddenLocation;
      this.encounter.type = 1;
      this.encounter.socialData = null;
      this.encounter.miscData = null;
     }

     if (this.selectedEncounterType === 'Misc'){
      this.encounter.miscData = this.misc;
      this.encounter.type = 2;
      this.encounter.socialData = null;
      this.encounter.hiddenLocationData = null;
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
