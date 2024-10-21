import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tour } from '../model/tour.model';
import { KeyPoint } from '../model/keypoint.model';
import { TourAuthoringService } from '../tour-authoring.service';
//import * as L from 'leaflet'; // Uvezi Leaflet
@Component({
  selector: 'xp-map-for-tour',
  templateUrl: './map-for-tour.component.html',
  styleUrls: ['./map-for-tour.component.css']
})




export class MapForTourComponent implements OnInit{

  @Input() tour: Tour;
  @Output() onCloseMap: EventEmitter<void> = new EventEmitter<void>();

 /* tour: Tour = {
    id: 2,
    name: "Tura2",
    description: "weasle farm",
    difficulty: "jos lakse",
    tags: [4],
    status: 0,
    price: 0,
    userId: 3,
    equipmentIds: [],
    keyPointIds: [7, 9, 13]
  };*/
  keyPoints: KeyPoint[] = [];

  constructor(private service: TourAuthoringService){}

  ngOnInit(): void{
    //console.log("NA INITU MAPE:");
    //console.log(this.tour);
    this.getTourKeyPoints();
    //this.markTourKeyPoints();
  }

  getTourKeyPoints(){
    if(this.tour.keyPointIds !== null){
      this.tour.keyPointIds.forEach(keyPointId => {
        // Placeholder za poziv servisa
        this.service.getKeyPointById(keyPointId).subscribe({
          next:(result: KeyPoint) => {
            this.keyPoints.push(result);
            //this.addMarker(result); // Dodaj marker kada se KeyPoint učita
          },
          error: (err: any) => console.log(err)
        })
        //console.log(keyPointId);

        
      });
      //console.log(this.keyPoints);
    }

  }
  closeMap(): void {
   /* const mainElement = document.querySelector('.main') as HTMLElement; // Castuj element kao HTMLElement
    if (mainElement) {
        mainElement.style.display = 'none'; // Sakrij .main
    }*/
   this.onCloseMap.emit();
  }

}
