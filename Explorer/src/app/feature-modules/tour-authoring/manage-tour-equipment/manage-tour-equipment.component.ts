import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Equipment } from '../model/equipment.model';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model'; 
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-manage-tour-equipment',
  templateUrl: './manage-tour-equipment.component.html',
  styleUrls: ['./manage-tour-equipment.component.css']
})
export class ManageTourEquipmentComponent implements OnInit {
  tourId: number; 
  allEquipment: Equipment[] = []; 
  filteredEquipment: Equipment[] = []; 
  selectedEquipment: Equipment[] = []; 
  searchQuery: string = '';

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
    this.fetchTourAndAvailableEquipment(); 
  }

  fetchTourAndAvailableEquipment(): void {
    // Get currently added equipment
    this.service.getTourEquipment(this.tourId).subscribe({
      next: (result: PagedResults<Equipment>) => {
        const addedEquipment = result.results;

        // Fetch all equipment
        this.service.getEquipment().subscribe({
          next: (result: PagedResults<Equipment>) => {
            this.allEquipment = result.results;

            // Filter out equipment already in the tour
            this.filteredEquipment = this.allEquipment.filter(eq =>
              !addedEquipment.some(addedEq => addedEq.id === eq.id)
            );
          },
          error: () => {
            console.error('Error fetching available equipment'); 
          }
        });
      },
      error: (err) => {
        console.error('Error fetching equipment for tour', err); 
      }
    });
  }

  toggleSelection(equipment: Equipment): void {
    if (this.selectedEquipment.includes(equipment)) {
      this.selectedEquipment = this.selectedEquipment.filter(eq => eq.id !== equipment.id);
    } else {
      this.selectedEquipment.push(equipment);
      console.log('Added eq: ',equipment);
      console.log('All selected eq:  ', this.selectedEquipment);
    }
  }
  filterEquipment(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEquipment = this.allEquipment.filter(eq =>
      eq.name.toLowerCase().includes(query) || 
      (eq.description && eq.description.toLowerCase().includes(query))
    );
  }

  onSave(): void {
    const addEquipmentObservables = this.selectedEquipment.map(eq => {
      if (eq.id != null) {
        return this.service.addTourEquipment(eq.id, { id: this.tourId } as Tour);
      } else {
        console.error(`Equipment ID is undefined for equipment: ${eq.name}`);
        return null;
      }
    }).filter(obs => obs !== null); 

    if (addEquipmentObservables.length > 0) {
      forkJoin(addEquipmentObservables).subscribe({
        next: results => {
          console.log('Added equipment successfully:', results);
          this.dialogRef.close(true); 
        },
        error: err => {
          console.error('Error adding equipment:', err);
          this.dialogRef.close(false); 
        }
      });
    } else {
      this.dialogRef.close(false); 
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}
