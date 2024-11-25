import { Component, Inject, Input } from '@angular/core';
import { Encounter ,EncounterType, SocialDataDto, HiddenLocationDataDto, MiscDataDto, EncounterStatus} from '../model/encounter.model';
import { EncounterServiceService } from '../encounter.service.service';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent {

  encounter: Encounter =  {
    id: 1,
    title: "kako ste",
    description: "Ovo je opis encoutnera",
    latitude: 45,       
    longitude: 45,     
    xp: 100,        
    status: EncounterStatus.Archived,    
    type: EncounterType.Social,  
    data: null,                  
    socialData: {
      requiredParticipants: 10,
      radius: 10
    } , 
    hiddenLocationData:  null, 
    miscData:  null,

  }

  constructor(private service: EncounterServiceService, 
    @Inject(MAT_DIALOG_DATA) public keyPoint: KeyPoint,
    private dialogRef: MatDialogRef<EncounterComponent>
    ){

  }

  ngOnInit(): void{
    
    this.service.GetByLatLong(this.keyPoint.latitude, this.keyPoint.longitude).subscribe({
      next: (encounter) => {
        /*this.encounter = encounter*/
      },
      error: () => {
      }
    });
    console.log("--------------------------")
    console.log("This encounter:")
    console.log(this.encounter)
    console.log("This KeyPoint:")
    console.log(this.keyPoint)
    console.log("--------------------------")
    
  }

  closeDialog(): void {
    this.dialogRef.close(!!this.encounter);
  }
  activateEncounter(): void {

  }
}
