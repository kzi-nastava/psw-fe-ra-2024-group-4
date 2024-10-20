import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { Equipment } from '../model/equipment.model';
import { TourService } from '../tour.service';
import { ActivatedRoute } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ManageTourEquipmentComponent } from '../manage-tour-equipment/manage-tour-equipment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'xp-necessary-equipment',
  templateUrl: './necessary-equipment.component.html',
  styleUrls: ['./necessary-equipment.component.css']
})
export class NecessaryEquipmentComponent implements OnInit {
  equipment: Equipment[] = [];
  tourId: number;
  tour: Tour;

  constructor(private service: TourService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if(!isNaN(id)) {
        this.tourId = id;
        this.getEquipment();
      } else {

      }
    });
  }

  getEquipment(): void {
    this.service.getTourEquipment(this.tourId).subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipment = result.results;
      },
      error: (err) => {
        console.error('Error fetching equipment for tour', err);
      }
    });
  }

  openEditDialog(eq: Equipment[]): void {
    const dialogRef = this.dialog.open(ManageTourEquipmentComponent, {
      width: '600px', 
      data: { tourId: this.tourId, equipment: eq } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Izmenjena oprema:', result);
        this.getEquipment();
      }
    });
  }


}
