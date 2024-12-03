import { Component, inject } from '@angular/core';
import { BundleFormComponent } from '../bundle-form/bundle-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'xp-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.css']
})
export class BundleComponent {
  readonly dialog = inject(MatDialog)
  
  onAddClick(): void{
    const dialogRef = this.dialog.open(BundleFormComponent, {
      data : {
        height: 'auto',
        width: '100%',        
        maxWidth: '500px'
      }
    });
  }

}
