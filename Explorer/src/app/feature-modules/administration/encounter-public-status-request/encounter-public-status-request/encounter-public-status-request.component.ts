import { Component } from '@angular/core';
import { Encounter } from 'src/app/feature-modules/encounters/model/encounter.model';
import { AdministrationService } from '../../administration.service';

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
  acceptEncounter(id: number){
    this.service.approveEncounter(id).subscribe({
      next: (response) => {
        console.log(response.Message);
        this.encounters = this.encounters.filter(encounter => encounter.id !== id);
      },
      error: (err) => {
        console.error('Error approving encounter:', err);
      }
    })
  }
  rejectEncounter(id: number){
    this.service.rejectEncounter(id).subscribe({
      next: (response) => {
        console.log(response.Message);
        this.encounters = this.encounters.filter(encounter => encounter.id !== id);
      },
      error: (err) => {
        console.error('Error rejecting encounter', err);
      }
    })
  }
}
