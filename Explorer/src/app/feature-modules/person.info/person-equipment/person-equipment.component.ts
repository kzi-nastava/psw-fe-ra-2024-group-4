import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { PersonInfoService } from '../person.info.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-person-equipment',
  templateUrl: './person-equipment.component.html',
  styleUrls: ['./person-equipment.component.css']
})
export class PersonEquipmentComponent implements OnInit{
	equipment: Equipment[] = []
	selectedEquipment: Equipment[] = []
	
constructor(private service: PersonInfoService) { }

  ngOnInit(): void {
    this.getEquipment();
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
