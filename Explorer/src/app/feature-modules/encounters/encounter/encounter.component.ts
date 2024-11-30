import { Component, Inject, Input } from '@angular/core';
import { Encounter ,EncounterType, SocialDataDto, HiddenLocationDataDto, MiscDataDto, EncounterStatus} from '../model/encounter.model';
import { EncounterServiceService } from '../encounter.service.service';
import { KeyPoint } from '../../tour-authoring/model/keypoint.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent {

  encounter: Encounter | null = null;
  activationSuccess = false;

  constructor(private service: EncounterServiceService, 
    @Inject(MAT_DIALOG_DATA) public keyPoint: KeyPoint,
    private dialogRef: MatDialogRef<EncounterComponent>
    ){

  }

  ngOnInit(): void {
    console.log("KeyPoint data provided to dialog:", this.keyPoint);
  
    const radius = 0.1; 
  
    this.service.getInRadius(radius, this.keyPoint.latitude, this.keyPoint.longitude).subscribe({
      next: (response) => {
        console.log("Response from server (getInRadius):", response);
  
        const matchingEncounter = response.results.find((encounter: Encounter) =>
          encounter.latitude === this.keyPoint.latitude &&
          encounter.longitude === this.keyPoint.longitude
        );
  
        if (matchingEncounter) {
          console.log("Matching encounter found:", matchingEncounter);
          this.encounter = matchingEncounter;
        } else {
          console.warn("No matching encounter found in radius.");
          this.encounter = null;
        }
      },
      error: (err) => {
        console.error("Error fetching encounters from backend:", err);
        this.encounter = null;
      }
    });
  }
  

  closeDialog(): void {
    this.dialogRef.close(!this.encounter);
  }
  
  activateEncounter(): void {
    if (!this.encounter) {
      console.error("No encounter to activate.");
      return;
    }

    this.service.activateEncounter(
      this.encounter.id ? this.encounter.id : 0,
      this.keyPoint.latitude,
      this.keyPoint.longitude
    ).subscribe({
      next: (updatedEncounter) => {
        console.log("Encounter successfully activated:", updatedEncounter);
        this.activationSuccess = true; 
        this.encounter = updatedEncounter; 
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error("Error activating encounter:", err);
      }
    });
  }

  getImage(image: String | undefined)
  {
    return environment.webroot + image;
  }
}
