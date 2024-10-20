import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Equipment } from '../model/equipment.model';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model'; 
import { forkJoin } from 'rxjs';

@Component({
  selector: 'xp-manage-tour-equipment',
  templateUrl: './manage-tour-equipment.component.html',
  styleUrls: ['./manage-tour-equipment.component.css']
})
export class ManageTourEquipmentComponent implements OnInit {
  tourId: number; 
  equipment: Equipment[] = []; 
  addedEquipment: Equipment[] = []; 

  constructor(
    public dialogRef: MatDialogRef<ManageTourEquipmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tourId: number, equipment: Equipment[] }, 
    private service: TourService 
  ) {}

  ngOnInit(): void {
    if (!this.data || !this.data.tourId) {
        console.error('Data or Tour ID is undefined!');
        return;
    }

    this.tourId = this.data.tourId; 
    this.getTourEquipment(); 
  }

  getTourEquipment(): void {
    console.log(`Fetching equipment for tour ID: ${this.tourId}`); 
    this.service.getTourEquipment(this.tourId).subscribe({
        next: (result: PagedResults<Equipment>) => {
            this.addedEquipment = result.results;
            console.log('Added Equipment:', this.addedEquipment); 
            this.getEquipment();
        },
        error: (err) => {
            console.error('Error fetching equipment for tour', err); 
        }
    });
  }

  getEquipment(): void {
    this.service.getEquipment().subscribe({
        next: (result: PagedResults<Equipment>) => {
            this.equipment = result.results;
            this.setSelectedEquipment(); 
        },
        error: () => {
            console.error('Error fetching available equipment'); 
        }
    });
  }

  setSelectedEquipment(): void {
    this.equipment.forEach(eq => {
      eq.selected = this.addedEquipment.some(addedEq => addedEq.id === eq.id);
      console.log(`Equipment ID: ${eq.id}, Selected: ${eq.selected}`);
    });
  }
  
  

  onNoClick(): void {
    this.dialogRef.close(); 
  }

  //TODO: refactor
  saveChanges(): void {
    const changes = this.equipment.filter(eq => eq.selected !== this.addedEquipment.some(addedEq => addedEq.id === eq.id));
  
    const addEquipmentObservables = changes
      .filter(eq => eq.selected)
      .map(eq => {
        if (eq.id != null) {
          return this.service.addTourEquipment(eq.id!, { id: this.tourId! } as Tour);
        } else {
          console.error(`Equipment ID is undefined for equipment: ${eq.name}`);
          return null;
        }
      })
      .filter(obs => obs !== null); 

      const removeEquipmentObservables = changes
      .filter(eq => !eq.selected) 
      .map(eq => {
        if (eq.id != null) {
          return this.service.removeEquipmentFromTour(eq.id!, this.tourId!); 
        } else {
          console.error(`Equipment ID is undefined for equipment: ${eq.name}`);
          return null;
        }
      })
      .filter(obs => obs !== null); 
    

    const allChanges = [...addEquipmentObservables, ...removeEquipmentObservables];
    
    if (allChanges.length > 0) {
      forkJoin(allChanges).subscribe({
        next: results => {
          console.log('All changes saved successfully:', results);
          this.dialogRef.close(true); 
        },
        error: err => {
          console.error('Error saving equipment changes:', err);
          this.dialogRef.close(false); 
        }
      });
    } else {
      this.dialogRef.close(false); 
    }
  }
}

  
  
  

