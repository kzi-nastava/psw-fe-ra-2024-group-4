import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BundleComponent } from './bundle/bundle.component';
import { BundleFormComponent } from './bundle-form/bundle-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesComponent } from './sales/sales.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { CouponComponent } from './coupon/coupon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { CouponViewComponent } from './coupon-view/coupon-view.component';


@NgModule({
  declarations: [
    BundleComponent,
    BundleFormComponent,
    SalesComponent,    
    CouponComponent,
    CouponViewComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
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
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule, 
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  exports: [
    BundleComponent,
    BundleFormComponent,
    CouponComponent,
    CouponViewComponent

  ]
})
export class PaymentsModule { }
