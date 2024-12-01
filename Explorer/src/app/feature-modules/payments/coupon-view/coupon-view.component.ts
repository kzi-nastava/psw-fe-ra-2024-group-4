import { Component, Input } from '@angular/core';
import { Coupon } from '../model/coupon.model';
import { CouponService } from '../coupon.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2';
@Component({
  selector: 'xp-coupon-view',
  templateUrl: './coupon-view.component.html',
  styleUrls: ['./coupon-view.component.css']
})
export class CouponViewComponent {
  @Input() authorId: number | undefined; // ID autora
  coupons: Coupon[] = []; // Svi kuponi za autora
  @Input() tours: Tour[] = [];
  editingStates = new Map<number, FormGroup>(); // Mapa za praćenje uređivanja

  constructor(private couponService: CouponService) {}
  showDeleteConfirmation(tourName: string): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the coupon for ${tourName}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  }
  
  showSuccessAlert(tourName: string): void {
    Swal.fire({
      title: 'Updated Successfully!',
      text: `You have successfully updated the coupon for ${tourName}.`,
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });
  }

  ngOnInit(): void {
    this.fetchAllCoupons();
  }

  fetchAllCoupons(): void {
    if(this.authorId){
      this.couponService.getAll(this.authorId).subscribe({
      next: (data) => {
        this.coupons = data.results;
      },
      error: (err) => {
        console.error('Error fetching coupons:', err);
      },
    });
  }
  
}
getTourNameById(tourId: number | undefined): string {
  const tour = this.tours.find(t => t.id === tourId);
  return tour ? tour.name : 'All tours'; // Vraća naziv ture ili 'Unknown Tour'
}
editCoupon(coupon: Coupon): void {
  if (!coupon.id) return;
  if (!this.editingStates.has(coupon.id)) {
    this.editingStates.set(
      coupon.id,
      new FormGroup({
        discountPercentage: new FormControl(coupon.discountPercentage, [
          Validators.required,
          Validators.min(1),
          Validators.max(100),
        ]),
        expirationDate: new FormControl(coupon.expirationDate || null),
      })
    );
  }
}

cancelEdit(coupon: Coupon): void {
  if (coupon.id) {
    this.editingStates.delete(coupon.id);
  }
}

saveCoupon(coupon: Coupon): void {
  if (!coupon.id || !this.editingStates.has(coupon.id)) return;

  const form = this.editingStates.get(coupon.id)!;

  if (form.valid) {
    const updatedCoupon = {
      ...coupon,
      discountPercentage: form.value.discountPercentage,
      expirationDate: form.value.expirationDate,
    };
    this.couponService.update(updatedCoupon).subscribe({
      next:()=>{
        const index = this.coupons.findIndex(c => c.id === coupon.id);
        if (index !== -1) {
          this.coupons[index] = updatedCoupon;
        }
        this.cancelEdit(coupon);
        const tourName = this.getTourNameById(coupon.tourId);
        this.showSuccessAlert(tourName);
      },
      error: (err) => {
        console.error('Error updating coupon:', err);
      },
    })

  }
}

deleteCoupon(coupon: Coupon): void {
  const tourName=this.getTourNameById(coupon.tourId);

  this.showDeleteConfirmation(tourName).then((result) => {
    if (result.isConfirmed && coupon.id) {
      this.couponService.delete(coupon.id).subscribe({
        next: () => {
          this.coupons = this.coupons.filter((c) => c.id !== coupon.id);
          Swal.fire('Deleted!', `The coupon for ${tourName} has been deleted.`, 'success');
        },
        error: (err) => {
          console.error('Error deleting coupon:', err);
        },
      });
    }
  });
}
}