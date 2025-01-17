import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Equipment } from '../model/equipment.model';
import { AdministrationService } from '../administration.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css']
})
export class EquipmentFormComponent implements OnChanges {

  @Output() equipmentUpdated = new EventEmitter<null>();
  @Input() equipment: Equipment;
  @Input() shouldEdit: boolean = false;

  isChatOpen: boolean = false; 
  chatMessage: string = 'Welcome to the Equipment Form! Here, you can add new equipment or update existing equipment details. Please fill in both the "Name" and "Description" fields. The form will show an error message if these fields are left empty. Once you’ve filled out the form, click the "Done" button to save your changes. If you’re editing an existing item, the form will update it accordingly.';
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  constructor(private service: AdministrationService) {
  }

  ngOnChanges(): void {
    this.equipmentForm.reset();
    if(this.shouldEdit) {
      this.equipmentForm.patchValue(this.equipment);
    }
  }

  equipmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  addEquipment(): void {
    if (this.equipmentForm.invalid) {
      this.showSwal('Warning', 'Please fill out all required fields.', 'warning');
      return;
    }
    const equipment: Equipment = {
      name: this.equipmentForm.value.name || '',
      description: this.equipmentForm.value.description || '',
    };
    this.service.addEquipment(equipment).subscribe({
      next: () => {
        this.showSwal('Success', 'Equipment added successfully!', 'success');
        this.equipmentForm.reset(); // Clear the form
        this.equipmentUpdated.emit();
      },
      error: () => {
        this.showSwal('Error', 'Failed to add equipment.', 'error');
      }
    });
  }

  updateEquipment(): void {
    if (this.equipmentForm.invalid) {
      this.showSwal('Warning', 'Please fill out all required fields.', 'warning');
      return;
    }
    const equipment: Equipment = {
      name: this.equipmentForm.value.name || '',
      description: this.equipmentForm.value.description || '',
    };
    equipment.id = this.equipment.id;
    this.service.updateEquipment(equipment).subscribe({
      next: () => {
        this.showSwal('Success', 'Equipment updated successfully!', 'success');
        this.equipmentForm.reset(); // Clear the form
        this.equipmentUpdated.emit();
      },
      error: () => {
        this.showSwal('Error', 'Failed to update equipment.', 'error');
      }
    });
  }

  private showSwal(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK',
      heightAuto: false
    });
  }
}
