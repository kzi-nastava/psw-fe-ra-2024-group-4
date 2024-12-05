import { Component } from '@angular/core';
import { Encounter, EncounterType } from 'src/app/feature-modules/encounters/model/encounter.model';
import { AdministrationService } from '../../administration.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-encounter-public-status-request',
  templateUrl: './encounter-public-status-request.component.html',
  styleUrls: ['./encounter-public-status-request.component.css']
})
export class EncounterPublicStatusRequestComponent {
  encounters: Encounter[] = [];

  constructor(private service: AdministrationService,private snackBar: MatSnackBar){}

  ngOnInit(): void{
    this.getPendingEncounters();
  }

  getPendingEncounters(){
    this.service.getRequestedEncounters().subscribe({
      next:(data: Encounter[]) =>{
        this.encounters = data;
      },
      error: (err) => {
        console.error('Error fetching pending encounters: ',err);
      }
    })
  }
  getEncounterType(type: number): string {
    return EncounterType[type];
  }
  acceptEncounter(id: number) {
    this.service.approveEncounter(id).subscribe({
      next: (response) => {
        console.log(response.Message);
        this.encounters = this.encounters.filter(encounter => encounter.id !== id);
        this.showSnackbar('Encounter successfully approved!', 'Close'); // Show snackbar
      },
      error: (err) => {
        console.error('Error approving encounter:', err);
        this.showSnackbar('Error approving encounter', 'Close'); // Show snackbar for error
      }
    });
  }

  rejectEncounter(id: number) {
    this.service.rejectEncounter(id).subscribe({
      next: (response) => {
        console.log(response.Message);
        this.encounters = this.encounters.filter(encounter => encounter.id !== id);
        this.showSnackbar('Encounter successfully rejected!', 'Close'); // Show snackbar
      },
      error: (err) => {
        console.error('Error rejecting encounter', err);
        this.showSnackbar('Error rejecting encounter', 'Close'); // Show snackbar for error
      }
    });
  }

  private showSnackbar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar duration in milliseconds
      verticalPosition: 'bottom', // Position at the bottom
      horizontalPosition: 'center' // Center align horizontally
    });
  }
}
