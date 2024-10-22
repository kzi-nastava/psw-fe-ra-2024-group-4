import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { PersonInfoService } from '../person.info.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PersonInfo } from '../model/info.model';

@Component({
  selector: 'xp-person-equipment',
  templateUrl: './person-equipment.component.html',
  styleUrls: ['./person-equipment.component.css']
})
export class PersonEquipmentComponent implements OnInit{
	equipment: Equipment[] = []
	selectedEquipment: number[] = []
  
  person: PersonInfo = {
    id : 0,
    userId: 0,
    name: '',
    surname: '',
    profilePicture: '',
    biography: '',
    motto: '',
    equipment: [] as number[]
  };
  
 constructor(private service: PersonInfoService, private authService: AuthService) {
	
	  
 }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user && user.id) {
        this.getPersonInfo(user.id);
      }
      });
    this.getEquipment();
	  
  }

  getPersonInfo(personId: number): void {
    this.service.getPersonInfo(personId).subscribe({
      next: (result: PersonInfo) => {
        this.person = result
      },
      error: (err) => {
        console.error('Error fetching person info:', err);  
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


  onCheckboxChange(equipmentId: number, event: Event): void {
    const checkbox = (event.target as HTMLInputElement);
    if (checkbox.checked) {
      // Add the selected equipment ID to the list
      this.selectedEquipment.push(equipmentId);
      console.log("Id added " + equipmentId)
    } else {
      // Remove the deselected equipment ID from the list
      this.selectedEquipment = this.selectedEquipment.filter(id => id !== equipmentId);
      console.log("Id removed " + equipmentId)
    }
  }

  saveChanges(): void {
    this.person.equipment = [...this.selectedEquipment];
    this.updatePersonEquipment();
  }

  updatePersonEquipment(): void {
    
    this.service.updatePersonInfo(this.person).subscribe({
      next: () => {
        console.log('Person equipment updated successfully');
        console.log(this.person)
      },
      error: (err) => {
        console.error('Error updating person equipment:', err);
      }
    });
  }
}

