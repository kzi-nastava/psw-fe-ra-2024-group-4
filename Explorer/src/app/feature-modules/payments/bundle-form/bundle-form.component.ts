import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Bundle, Status } from '../../tour-authoring/model/budle.model';
import { PaymentsService } from '../payments.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TourSelectionDialogComponent } from '../tour-selection-dialog/tour-selection-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-bundle-form',
  templateUrl: './bundle-form.component.html',
  styleUrls: ['./bundle-form.component.css']
})
export class BundleFormComponent implements OnInit{
  tours: Tour[]=[];
  user: User|null=null;
  totalPrice: number = 0; 
  nextId: number=0;
  selectedTours: Tour[]=[]

  constructor(private tourService: TourService, private authService: AuthService, 
    private service: PaymentsService, private dialog: MatDialog, private router: Router){}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      console.log(user);
    });
  }

  bundleForm=new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    tourIds: new FormControl<number[]>([], [Validators.required])
  })


  openTourDialog(): void {
    if (this.user && this.user.role === 'author') {
      this.tourService.getToursForAuthor(this.user.id).subscribe({
        next: (result: Tour[]) => {
          // Povezivanje dostupnih tura
          this.tours = result;
          console.log('Tours loaded:', this.tours);
  
          // Otvaranje dijaloga
          const dialogRef = this.dialog.open(TourSelectionDialogComponent, {
            width: '400px',
            data: { 
              tours: this.tours,
              selectedTours: [] // Prosleđivanje prazne selekcije
            }
          });
  
          // Nakon zatvaranja dijaloga ažuriraj selektovane ture
          dialogRef.afterClosed().subscribe((selectedTours: Tour[]) => {
            if (selectedTours) {
              this.selectedTours = selectedTours;
              this.calculateTotalPrice();
              console.log("Selected tours after dialog closed:", this.selectedTours);
            }
          });
        },
        error: (error) => {
          console.error('Error fetching tours:', error);
        }
      });
    } else {
      console.warn('User is not authorized or not logged in.');
    }
  }
  
  
  

  removeTour(tour: Tour): void {
    this.selectedTours = this.selectedTours.filter(t => t !== tour);
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.selectedTours.reduce((total, tour) => total + tour.price, 0);
  }
  

  addBundle(): void {
    console.log(this.tours);
    const selectedTourIds: number[] = this.tours
      .filter((tour) => tour.selected && tour.id !== undefined)
      .map((tour) => tour.id!);
  
    const bundle: Bundle = {
      name: this.bundleForm.value.name || '',
      price: this.bundleForm.value.price || 0,
      authorId: this.user?.id ?? -1,
      status: Status.DRAFT,
      tourIds: selectedTourIds,
      tours: []
    };
  
    console.log(bundle);
  
    if (this.totalPrice !== 0) {
      this.service.addBundle(bundle).subscribe({
        next: (result: Bundle) => {
          console.log(bundle.name);
          // Navigacija na drugu stranicu, npr. "/bundles"
          this.router.navigate(['/author-tours']);
        },
        error: (error) => {
          console.error('Error adding bundle:', error);
        }
      });
    }
  }
  
}
