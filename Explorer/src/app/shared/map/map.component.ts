import { Component, AfterViewInit, Input, Output, EventEmitter,SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { KeypointFormComponent } from 'src/app/feature-modules/tour-authoring/keypoint-form/keypoint-form.component';
import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/keypoint.model';
import { TourObject } from 'src/app/feature-modules/tour-authoring/model/object.model';
import { waitForAsync } from '@angular/core/testing';
import { PositionSimulator } from 'src/app/feature-modules/tour-authoring/model/position-simulator.model';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';


@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  @Input() selectedLatitude: number;
  @Input() selectedLongitude: number;
  @Input() selectedTourPoints: KeyPoint[];
  @Input() objects: TourObject[] = [];
  @Input() registerObjectRoute: boolean = false;
  @Input() positionSimulatorActivated: boolean = false;
  @Input() registeringObject: boolean = false;
  @Input() showingTour: boolean = false;
  currentPosition: PositionSimulator;

  @Output() latitudeChanged = new EventEmitter<number>();
  @Output() longitudeChanged = new EventEmitter<number>();
  @Output() touristPositionCreate = new EventEmitter<PositionSimulator>();
  @Output() touristPositionUpdate = new EventEmitter<PositionSimulator>();

  @Input() shouldEditKp: boolean = false;
   @Input() selectedKeypoint: KeyPoint;
  
   user: User;
  

   private map: any;
   private currentMarker: L.Marker | null = null; 
   private selectedTourPointsMarkers: L.Marker[] = []; // Niz markera


   private redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });


   constructor(private mapService: MapService, private service: TourExecutionService, private authService: AuthService) {}

   
   
  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    
    if(this.registeringObject && !this.shouldEditKp)
    { 
      this.registerOnClick();

    }

    if(this.registerObjectRoute)
    {
      
      this.setRoute(this.selectedTourPoints);
      this.registerOnClick()
     
    }

    if(this.registeringObject && this.shouldEditKp)
      { 
        
        this.showPoint();
        this.registerOnClick();
  
      }
    if(this.showingTour)
    {  

      
     /* if (!this.selectedTourPoints || this.selectedTourPoints.length === 0) {
        console.warn('No key points available to drawwwww.');
        return; // Izlazi ako nema key pointova
      }*/
       this.setRoute(this.selectedTourPoints); //xd
       console.log("Kljucne tacke poslate:");
       console.log(this.selectedTourPoints);
       console.log("SHOWING ROUTES");
      // this.drawRoute(this.selectedTourPoints);
    }
   
    this.getCurrentPosition();
    if(this.positionSimulatorActivated)
    {
      
     
        
      
      this.registerPosition();
    }

  }

  getCurrentPosition() : void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    if(this.user)
    {

      
      this.service.getPositionByTourist(this.user.id).subscribe({
        next: (result: PositionSimulator) => 
        {
          
          this.currentPosition = result;
          this.showCurrentPosition(this.currentPosition.longitude, this.currentPosition.latitude);
          
         
        },
        error: (err: any) => {
          console.log("Error fetching position:", err);
         
      }
       
      })

     
  

     
    }
  }

  


  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['objects'] && this.map) {
      this.plotExistingObjects(); 
    }
  }


  showPoint() : void
  {
    this.currentMarker = new L.Marker([this.selectedKeypoint.latitude, this.selectedKeypoint.longitude]).addTo(this.map);
  }

  showCurrentPosition(longitude: number, latitude: number){
    this.currentMarker = new L.Marker([latitude, longitude]).addTo(this.map);
  }

  registerOnClick(): void {
    
   
    this.map.on('click', (e: any) => {
      
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      // this.mapService.reverseSearch(lat, lng).subscribe((res) => {
      //   console.log(res.display_name);
      // });
      // console.log(
      //   'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      // );

      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
    }

      this.currentMarker = new L.Marker([lat, lng]).addTo(this.map);
      
      this.latitudeChanged.emit(lat);
      this.longitudeChanged.emit(lng);
    });
    this.plotExistingObjects();
  }

  registerPosition(): void {
    
   
    this.map.on('click', (e: any) => {
      
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      
     

      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
    }

      this.currentMarker = new L.Marker([lat, lng]).addTo(this.map);
      
      if(!this.currentPosition)
        {
          let newPosition: PositionSimulator = {
            longitude: lng,
            latitude: lng,
            touristId: -1
          } as PositionSimulator;
          newPosition.longitude = lng;
          newPosition.latitude = lat;
         
          this.touristPositionCreate.emit(newPosition);
         
        }
        else
        {
          this.currentPosition.longitude = lng;
          this.currentPosition.latitude = lat;
          this.touristPositionUpdate.emit(this.currentPosition);
        }
     
    });
    this.plotExistingObjects();
  }

  search(): void {
    this.mapService.search('Strazilovska 19, Novi Sad').subscribe({
      next: (result) => {
        //console.log(result);
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup('Pozdrav iz Strazilovske 19.')
          .openPopup();
      },
      error: () => {},
    });
  }

  async setRoute(keyPoints: KeyPoint[]) {
    await new Promise(resolve => setTimeout(resolve, 500));
   // console.log("Setting route!");
   // console.log("tacke iz setRoute:");
   // console.log(keyPoints);
    const waypoints = keyPoints.map(point => L.latLng(point.latitude, point.longitude));
    const routeControl = L.Routing.control({
      waypoints: waypoints,
      router: L.routing.mapbox('pk.eyJ1IjoidmVsam9vMDIiLCJhIjoiY20yaGV5OHU4MDFvZjJrc2Q4aGFzMTduNyJ9.vSQUDO5R83hcw1hj70C-RA', {profile: 'mapbox/walking'}),
    }).addTo(this.map);

  /*  routeControl.on('routesfound', function(e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    });*/
  }
  private plotExistingObjects(): void {
    this.objects.forEach((obj: TourObject) => {
      L.marker([obj.latitude, obj.longitude], { icon: this.redIcon })
        .addTo(this.map)
        .bindPopup(`<strong>${obj.name}</strong><br>${obj.description}`);
    });
  }
  

  drawRoute(keyPoints: KeyPoint[]): void{
    keyPoints.forEach(keyPoint =>{
      const newMarker = L.marker([keyPoint.latitude, keyPoint.longitude]).addTo(this.map);
    });
  }

  

 


}
