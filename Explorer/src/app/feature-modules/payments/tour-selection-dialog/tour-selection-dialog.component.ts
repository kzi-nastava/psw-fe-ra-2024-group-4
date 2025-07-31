import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'app-tour-selection-dialog',
  templateUrl: './tour-selection-dialog.component.html',
  styleUrls: ['./tour-selection-dialog.component.css']
})
export class TourSelectionDialogComponent {
  tours: Tour[] = [];
  selectedTours: Tour[] = [];


  isChatOpen: boolean = false; 
  chatMessage: string = 'Here you can view and select the tours you want to include in your package. Click on any tour to select it, and it will be marked with a check (✓). Once you have selected your tours, click the "Add Tours" button to finalize your choices. If you need any help, feel free to ask!';
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tours: Tour[], selectedTours: Tour[] },
    private dialogRef: MatDialogRef<TourSelectionDialogComponent>
  ) {
    this.tours = data.tours;
    this.selectedTours = data.selectedTours;
    
    this.tours.forEach(tour => {
      tour.selected = this.selectedTours.some(selectedTour => selectedTour.id === tour.id);
    });
  }

  selectTour(tour: Tour): void {
    tour.selected = !tour.selected;
    if (tour.selected) {
      this.selectedTours.push(tour);
    } else {
      this.selectedTours = this.selectedTours.filter(t => t.id !== tour.id);
    }
  }

  addTours(): void {
    this.dialogRef.close(this.selectedTours); 
  }
  
}
