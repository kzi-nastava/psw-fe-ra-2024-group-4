import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CouponService } from '../coupon.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Coupon } from '../model/coupon.model';

@Component({
  selector: 'xp-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent  implements OnChanges{
  @Input() tour: Tour; //selektovana tura
  @Output() close = new EventEmitter<void>();
  @Output() couponCreated = new EventEmitter<any>();
  user:User| null=null;
  ngOnChanges(): void {
    this.couponForm.reset();
  }
  constructor(private service:CouponService,private authService: AuthService){
    this.authService.user$.subscribe((user)=>{
      this.user=user;
    })
  }


  couponForm=new FormGroup({
    discount: new FormControl(0,[Validators.required,
      Validators.min(0),
      Validators.max(100)
    ]),
    expirationDate: new FormControl(null)
  })
get discountInvalid(): boolean {
  const discountControl = this.couponForm.get('discount');
  const discountValue = Number(discountControl?.value);
  return (
    (discountControl?.invalid && discountControl?.touched) ||
    (isNaN(discountValue) && (discountValue <= 0 || discountValue > 100))
  );
}
get dateInvalid(){
  const expirationDate=this.couponForm.value.expirationDate;
  if(expirationDate){
  const selectedDate = new Date(expirationDate);
  const today = new Date();
  return selectedDate<today;
  }
  return false;
}
validation():boolean{
    if (!this.user) {
      return false;
    }
    const discount = this.couponForm.value.discount;
    const expirationDate = this.couponForm.value.expirationDate;
    if (discount !== null && discount !== undefined) {
      if (isNaN(discount) || discount < 0 || discount > 100) {
        return false;
      }
    }
    if (expirationDate) {
      const today = new Date();
      const selectedDate = new Date(expirationDate);
      if (selectedDate <= today) {
        return false;
      }
    }
    return true;
  }

  submitCoupon(): void{
    if(this.validation()){
      const coupon:Coupon={
        discountPercentage: this.couponForm.value.discount || 0,
        expirationDate: this.couponForm.value.expirationDate,
        tourId: this.tour.id,
        authorId: this.user?.id || 0,
      }
      this.service.addCoupon(coupon).subscribe({
        next:
        ()=>{this.couponCreated.emit(); 
          alert("uspesno");
          this.close.emit();
        }
      })
    }
  }
}
