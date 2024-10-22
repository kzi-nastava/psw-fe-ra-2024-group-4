import { Component, EventEmitter, Input, OnInit ,Output} from '@angular/core';
import {TourObject} from '../model/object.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';


@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  objects: TourObject[] = [];
  selectedObject: TourObject | null = null;
  constructor(private service: TourAuthoringService, private authService: AuthService){}

  selectedLatitude: number | null = null;
  selectedLongitude: number | null = null;

  ngOnInit(): void {
    this.getObjects();
  }

  getObjects(): void{
    
    this.service.getObjects().subscribe({
      next: (result: PagedResults<TourObject>) => {
        this.objects = result.results; 
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  updateLongitude(newLongitude: number): void{
    this.selectedLongitude = newLongitude;
    
  }
  updateLatitude(newLatitude: number): void{
    this.selectedLatitude = newLatitude;
    
  }
  editObject(item: TourObject): void{
    this.selectedObject = item;
  }

  /*objects: TourObject[] = [
    {
      id: 1,
      name: 'Park za pse',
      description: 'Ogroman park sa ograđenim delom za pse, savršen za šetnje i druženje sa ljubimcima.',
      image: 'park-za-pse.jpg',
      category: 'Park',
      longitude: 20.457273,
      latitude: 44.786568,
      userId: 101
    },
    {
      id: 2,
      name: 'Restoran Uživanje',
      description: 'Restoran sa prelepim pogledom na reku, sa specijalitetima tradicionalne kuhinje.',
      image: 'restoran-uzivanje.jpg',
      category: 'Restaurant',
      longitude: 20.462534,
      latitude: 44.814078,
      userId: 102
    },
    {
      id: 3,
      name: 'Garaža Centar',
      description: 'Velika garaža u centru grada, dostupna 24/7, sa naplatom po satu.',
      image: 'garaza-centar.jpg',
      category: 'Parking',
      longitude: 20.471024,
      latitude: 44.800452,
      userId: 103
    }
  ];*/
  
}
