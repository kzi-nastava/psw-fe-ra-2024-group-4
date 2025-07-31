import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmazingPopupComponent } from './test-popup/test-popup.component';
import { CustomPopupComponent } from './custom-popup/custom-popup.component';


@NgModule({
  declarations: [AmazingPopupComponent, CustomPopupComponent],
  imports: [
    CommonModule
  ],
  exports:[AmazingPopupComponent, CustomPopupComponent]
})
export class PopupsModule { }
