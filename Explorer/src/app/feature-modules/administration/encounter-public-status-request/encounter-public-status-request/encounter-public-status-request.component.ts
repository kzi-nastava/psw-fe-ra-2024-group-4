import { Component } from '@angular/core';
import { Encounter, EncounterType } from 'src/app/feature-modules/encounters/model/encounter.model';
import { AdministrationService } from '../../administration.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-encounter-public-status-request',
  templateUrl: './encounter-public-status-request.component.html',
  styleUrls: ['./encounter-public-status-request.component.css']
})
export class EncounterPublicStatusRequestComponent {
  encounters: Encounter[] = [];

  constructor(private service: AdministrationService){}

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
        this.showSwal('Success', 'Encounter successfully approved!', 'success'); 
      },
      error: (err) => {
        console.error('Error approving encounter:', err);
        this.showSwal('Error', 'Error approving encounter', 'error');
      }
    });
  }

  rejectEncounter(id: number) {
    this.service.rejectEncounter(id).subscribe({
      next: (response) => {
        console.log(response.Message);
        this.encounters = this.encounters.filter(encounter => encounter.id !== id);
        this.showSwal('Success', 'Encounter successfully rejected!', 'success');
      },
      error: (err) => {
        console.error('Error rejecting encounter', err);
        this.showSwal('Error', 'Error rejecting encounter', 'error'); 
      }
    });
  }

  private showSwal(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK',
      heightAuto: false // Sprečava automatsko menjanje visine
    });
  }
}
