import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponComponent } from './coupon/coupon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CouponViewComponent } from './coupon-view/coupon-view.component';


@NgModule({
  declarations: [
    CouponComponent,
    CouponViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports:[
    CouponComponent,
    CouponViewComponent
  ]
})
export class PaymentsModule { }
