import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { TourObject } from '../model/object.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.css']
})
export class ObjectFormComponent implements OnInit {
  
  @Output() objectCreated = new EventEmitter<null>();

  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;

  

  user: User | undefined;
  constructor (private service: TourAuthoringService, private authService: AuthService) {} 

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    if (this.latitude !== null) {
      this.objectForm.controls['latitude'].setValue(this.latitude);
    }
    if (this.longitude !== null) {
      this.objectForm.controls['longitude'].setValue(this.longitude);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['latitude'] && changes['latitude'].currentValue !== undefined) {
      this.objectForm.controls['latitude'].setValue(changes['latitude'].currentValue);
    }

    if (changes['longitude'] && changes['longitude'].currentValue !== undefined) {
      this.objectForm.controls['longitude'].setValue(changes['longitude'].currentValue);
    }
  }

  objectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),          
    longitude: new FormControl(0.0, [Validators.required]),    
    latitude: new FormControl(0.0, [Validators.required]),      
    description: new FormControl('', [Validators.required]),
    image: new FormControl(''),                              
    category: new FormControl('', [Validators.required])      
  });

  



  getCategoryValue(): number {
    const category = this.objectForm.value.category;
  
    switch (category) {
      case 'WC':
        return 0;
      case 'Restaurant':
        return 1;
      case 'Parking':
        return 2;
      case 'Other':
        return 3;
      default:
        return -1; // Default value if no matching category is found
    }
  };

  getNumberOfObjects(callback: (count: number) => void): void {
    this.service.getObjects().subscribe({
      next: (result: PagedResults<TourObject>) => {
        callback(result.totalCount);
      },
      error: (err: any) => {
        console.log(err);
        callback(0);  
      }
    });
  }
  
  

  addObject(): void {
    this.getNumberOfObjects((objectCount: number) => {
      const object: TourObject = {
        id: objectCount + 1,
        name: this.objectForm.value.name || '',                  
        longitude: Number(this.objectForm.value.longitude) || 0, 
        latitude: Number(this.objectForm.value.latitude) || 0, 
        description: this.objectForm.value.description || '',    
        image: this.objectForm.value.image || '',                
        category: this.getCategoryValue() || 0,           
        userId: this.user?.id ?? -1
      };
  
      // Proceed to add the object after gathering the count
      this.service.addObject(object).subscribe({
        next: (_) => {
          this.objectCreated.emit();
          this.objectForm.reset();
        },
        error: (err) => {
          console.log('Error adding object:', err);
        }
      });
    });
  }
  
}
