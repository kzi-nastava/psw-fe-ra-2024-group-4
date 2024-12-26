import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { Equipment } from '../model/equipment.model';
import { TourService } from '../tour.service';
import { ActivatedRoute } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ManageTourEquipmentComponent } from '../manage-tour-equipment/manage-tour-equipment.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'xp-necessary-equipment',
  templateUrl: './necessary-equipment.component.html',
  styleUrls: ['./necessary-equipment.component.css']
})
export class NecessaryEquipmentComponent implements OnInit {
  equipment: Equipment[] = [];
  tourId: number;
  tour: Tour;
  searchQuery: string = '';
  filteredEquipment: Equipment[] = [];

  tourTagMap: { [key: number]: string } = {
    0: 'Cycling',
    1: 'Culture',
    2: 'Adventure',
    3: 'FamilyFriendly',
    4: 'Nature',
    5: 'CityTour',
    6: 'Historical',
    7: 'Relaxation',
    8: 'Wildlife',
    9: 'NightTour',
    10: 'Beach',
    11: 'Mountains',
    12: 'Photography',
    13: 'Guided',
    14: 'SelfGuided'
  };

  constructor(private service: TourService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if(!isNaN(id)) {
        this.tourId = id;
        this.getEquipment();
        this.fetchTour();
      } else {

      }
    });
  }
  getTagNames(tags: number[]): string[] {
    return tags.map(tagId => this.tourTagMap[tagId]).filter(tag => tag !== undefined);
  }

  fetchTour() : void{
    this.service.getByIdTour(this.tourId).subscribe({
      next: (result: Tour) => {
        this.tour = result;
      },
      error: (err) => {
        console.log('Error fetching tour');
      }
    })
  }

  getEquipment(): void {
    this.service.getTourEquipment(this.tourId).subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipment = result.results;
        this.filteredEquipment = [...this.equipment];
      },
      error: (err) => {
        console.error('Error fetching equipment for tour', err);
      }
    });
  }
  filterEquipment(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEquipment = this.equipment.filter((eq) =>
      eq.name.toLowerCase().includes(query)
    );
  }

  openEditDialog(eq: Equipment[]): void {
    const dialogRef = this.dialog.open(ManageTourEquipmentComponent, {
      width: '600px', 
      height: '90%',
      data: { tourId: this.tourId, equipment: eq } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Izmenjena oprema:', result);
        this.getEquipment();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Equipment successfully added!',
          showConfirmButton: true, // Prikazuje dugme za potvrdu
          confirmButtonText: 'Close', // Tekst na dugmetu
          position: 'center',
        });
        
        
      }
    });
  }
  deleteEquipment(index: number, equipment: Equipment): void {
    // Remove the equipment from the local list
    this.equipment.splice(index, 1);
    this.filteredEquipment = [...this.equipment];
    this.searchQuery='';
    
  
    // Call the service to mark the tour as unchecked
    this.service.removeEquipmentFromTour(equipment.id!, this.tourId).subscribe({
      next: (() => {
        console.log(`Removed equipment ID: ${equipment.id} from tour ID: ${this.tourId}`);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Equipment successfully removed!',
          showConfirmButton: true, // Prikazuje dugme za potvrdu
          confirmButtonText: 'Close', // Tekst na dugmetu
          position: 'center',
        });
        
      }),
      error: (err) => console.error('Error removing equipment:', err),
    });
  }
  


}
