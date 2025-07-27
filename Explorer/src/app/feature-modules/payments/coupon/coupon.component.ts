import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CouponService } from '../coupon.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Coupon } from '../model/coupon.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent  implements OnChanges{
  @Output() close = new EventEmitter<void>();
  @Output() couponCreated = new EventEmitter<any>();
  @Input() tour?: Tour; // Specifična tura (može biti undefined za sve ture)
  @Input() isForAllTours: boolean = false; // Signalizuje da je za sve ture
  @Input() viewMode: boolean = false; // Indikator za prikaz postojećeg kupona
  tourId?: number;
  existingCoupon: Coupon| null=null;
  user:User| null=null;
  showSuccessAlert(tourName: string | undefined): void {
    Swal.fire({
      title: 'Added Successfully!',
      text: `You have successfully added the coupon for ${tourName}.`,
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });
  }
  ngOnChanges(): void {
    console.log(this.viewMode)
    this.tourId=this.tour?.id;
    console.log(this.tourId)
    if (this.viewMode && this.tourId) {
      this.fetchCoupon(this.tourId);
    } else {
      this.couponForm.reset();
    }
  }

  isChatOpen: boolean = false; 
  chatMessage: string = 'This page allows you to create a new coupon for a specific tour or all tours. You can set a discount percentage, choose an expiration date, and submit the coupon for creation. If the coupon already exists, its details, including promo code, discount, and expiration date, will be displayed.';
  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
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
        tourId: this.isForAllTours ? undefined: this.tour?.id,
        authorId: this.user?.id || 0,
      }
      console.log(coupon);
      this.service.addCoupon(coupon).subscribe({
        next:
        ()=>{this.couponCreated.emit(); 
          this.showSuccessAlert(this.tour?.name);
          this.close.emit();
        }
      })
    }
  }
  fetchCoupon(tourId: number): void {
    this.service.getByTourId(tourId).subscribe({
      next:(coupon)=>{
        this.existingCoupon=coupon;
      },
      error: (err)=>{
        console.error('Error fetching coupon:', err);
      }
    })
  }
}
