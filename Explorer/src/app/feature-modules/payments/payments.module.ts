import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales/sales.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  declarations: [
    SalesComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    BrowserModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule, // obavezno za podršku za odabir datuma

  ]
})
export class PaymentsModule { }
