import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'xp-keypoint-dialog',
  templateUrl: './keypoint-dialog.component.html',
  styleUrls: ['./keypoint-dialog.component.css']
})
export class KeypointDialogComponent {

  @Output() refreshEvent = new EventEmitter<null>();
  constructor(private dialogRef: MatDialogRef<KeypointDialogComponent>) {}

  closeDialog(): void{

    this.dialogRef.close();

  }


}
