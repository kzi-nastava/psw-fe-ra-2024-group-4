import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Bundle, Status } from '../../tour-authoring/model/budle.model';
import { PaymentsService } from '../payments.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

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

  constructor(private tourService: TourService, private authService: AuthService, private service: PaymentsService){}

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

getTours(id: number): void {
  this.tourService.getToursForAuthor(id).subscribe({
    next: (result: Tour[]) => {
      this.tours = result.map(tour => ({
        ...tour,
        selected: false 
      }));
      console.log(this.tours); 
    },
    error: (error) => {
      console.error('Error fetching tours:', error);
    }
  });
}

  loadTours(): void {
    if (this.user && this.user.role === 'author') {
      this.getTours(this.user.id);
    } else {
      console.warn('User is not authorized or not logged in.');
    }
  }

  onTourChange(event: MatCheckboxChange, tour: Tour): void {
    const tourIdsControl = this.bundleForm.get('tourIds')!;
    const selectedTourIds = tourIdsControl.value || []; // Trenutni niz ID-ova
  
    if (event.checked) {
      // Dodaj ID ture u niz ako nije već prisutan
      if (!selectedTourIds.includes(tour.id!)) {
        selectedTourIds.push(tour.id!);
      }
    } else {
      // Ukloni ID ture iz niza
      const index = selectedTourIds.indexOf(tour.id!);
      if (index >= 0) {
        selectedTourIds.splice(index, 1);
      }
    }
  
    // Ažuriraj vrednost kontrola forme i "selected" status ture
    tourIdsControl.setValue(selectedTourIds);
    tour.selected = event.checked;
  
    // Opcionalno ažurirajte ukupan iznos
    this.updateTotalPrice();
  }
  
  

  updateTotalPrice(): void {
    this.totalPrice = this.tours.filter(tour => tour.selected).reduce((sum, tour) => sum + tour.price, 0);
    console.log(this.totalPrice);
  }

  addBundle(): void{
    console.log(this.tours);
    const selectedTourIds: number[] = this.tours
    .filter((tour) => tour.selected && tour.id !== undefined) 
    .map((tour) => tour.id!);
  
    const bundle: Bundle = {
      name: this.bundleForm.value.name || '',                
      price: this.bundleForm.value.price || 0,           
      authorId: this.user?.id ?? -1,
      status: Status.DRAFT,
      tourIds: selectedTourIds
    };
    console.log(bundle)
      this.service.addBundle(bundle).subscribe({
         next: (result: Bundle) => {
          console.log(bundle.name);
         }
      });
    
  }
}
