import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model'; 
import { Equipment } from '../model/equipment.model'; 
import { TourService } from '../tour.service';

@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent implements OnInit {

  tourId: number;
  equipment: Equipment[] = [];

  constructor(private route: ActivatedRoute, private service: TourService) { }

  ngOnInit(): void {
    this.getEquipment();
    this.route.params.subscribe(params => {
      const id = +params['id']; 
      if (!isNaN(id)) {
        this.tourId = id; 
        this.getEquipment();
      } else {
      }
    });
  }

  getEquipment(): void {
    this.service.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipment = result.results;
      },
      error: () => {
      }
    })
  }

}
