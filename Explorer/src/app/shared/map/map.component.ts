import { Component, AfterViewInit, Input, Output, EventEmitter,SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import { MapService } from './map.service';
import { KeypointFormComponent } from 'src/app/feature-modules/tour-authoring/keypoint-form/keypoint-form.component';
import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/keypoint.model';
import { TourObject } from 'src/app/feature-modules/tour-authoring/model/object.model';
import { waitForAsync } from '@angular/core/testing';
import { PositionSimulator } from 'src/app/feature-modules/tour-authoring/model/position-simulator.model';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { outputAst } from '@angular/compiler';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { TourOverview } from 'src/app/feature-modules/tour-authoring/model/touroverview.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Encounter, EncounterStatus, EncounterType } from 'src/app/feature-modules/encounters/model/encounter.model';
import { Router } from '@angular/router';




@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  @Input() selectedLatitude: number;
  @Input() selectedLongitude: number;
  @Input() selectedTourPoints: KeyPoint[];
  @Input() selectedObjectPoints: TourObject[] = [];
  @Input() objects: TourObject[] = [];
  @Input() registerObjectRoute: boolean = false;
  @Input() positionSimulatorActivated: boolean = false;
  @Input() registeringObject: boolean = false;
  @Input() showingTour: boolean = false;
  @Input() tourSearchActivated: boolean = false;
  @Input() showingFirstKp: boolean = false;
  @Input() tourOverview: TourOverview;
  @Input() showEncounters: boolean = false;
  @Input() selectedEncounterPoints: Encounter[];
  currentPosition: PositionSimulator;

  @Output() latitudeChanged = new EventEmitter<number>();
  @Output() longitudeChanged = new EventEmitter<number>();
  @Output() touristPositionCreate = new EventEmitter<PositionSimulator>();
  @Output() touristPositionUpdate = new EventEmitter<PositionSimulator>();
  @Output() tourSearchLat=new EventEmitter<number>();
  @Output() tourSearchLon=new EventEmitter<number>();
  @Output() objectClicked = new EventEmitter<TourObject>();


  @Output() distanceChanged = new EventEmitter<number>();

  @Input() shouldEditKp: boolean = false;
  @Input() selectedKeypoint: KeyPoint;
  @Input() mapId: string = 'map';
  
  user: User;
   


  private map: any;
  private currentMarker: L.Marker | null = null; 
  private selectedTourPointsMarkers: L.Marker[] = []; // Niz markera
  private selectedEncounterMarkers: L.Marker[] = [];
  private selectedObjectMarkers: L.Marker[] = [];
   


  private redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  private positionIcon = L.icon({
    iconUrl: 'assets/icons/positionmark.svg',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  private keypointIcon = L.icon({
    iconUrl: 'assets/icons/keypointmark.svg',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  private encounterMarker = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
  private wcIcon = L.icon({
    iconUrl: 'assets/icons/objects/WC.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private restaurantIcon = L.icon({
    iconUrl: 'assets/icons/objects/restaurant.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private parkingIcon = L.icon({
    iconUrl: 'assets/icons/objects/parking.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private viewpointIcon = L.icon({
    iconUrl: 'assets/icons/objects/viewpoint.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private churchIcon = L.icon({
    iconUrl: 'assets/icons/objects/church.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private mosqueIcon = L.icon({
    iconUrl: 'assets/icons/objects/mosque.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private bridgeIcon = L.icon({
    iconUrl: 'assets/icons/objects/bridge.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private beachIcon = L.icon({
    iconUrl: 'assets/icons/objects/beach.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private parkIcon = L.icon({
    iconUrl: 'assets/icons/objects/park.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private fountainIcon = L.icon({
    iconUrl: 'assets/icons/objects/fountain.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private shoppingCenterIcon = L.icon({
    iconUrl: 'assets/icons/objects/shopping-center.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private museumIcon = L.icon({
    iconUrl: 'assets/icons/objects/museum.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private marketPlaceIcon = L.icon({
    iconUrl: 'assets/icons/objects/market-place.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private nightClubIcon = L.icon({
    iconUrl: 'assets/icons/objects/night-club.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
private otherIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
private stadiumIcon = L.icon({
  iconUrl: 'assets/icons/objects/stadium.png',
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
private fortressIcon = L.icon({
  iconUrl: 'assets/icons/objects/castle.png',
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
private getObjectIcon(category: number): L.Icon {
  switch (category) {
    case 0:
      return this.wcIcon;
    case 1:
      return this.restaurantIcon;
    case 2:
      return this.parkingIcon;
    case 3:
      return this.viewpointIcon;
    case 4:
      return this.churchIcon;
    case 5:
      return this.mosqueIcon;
    case 6:
      return this.bridgeIcon;
    case 7:
      return this.beachIcon;
    case 8:
      return this.parkIcon;
    case 9:
      return this.fountainIcon;
    case 10:
      return this.shoppingCenterIcon;
    case 11:
      return this.museumIcon;
    case 12:
      return this.marketPlaceIcon;
    case 13:
      return this.nightClubIcon;
    case 14:
      return this.stadiumIcon;
    case 15:
      return this.fortressIcon;
    case 16:
      return this.otherIcon;
    default:
      return this.otherIcon;
  }
}




   constructor(private http: HttpClient,private mapService: MapService, private service: TourExecutionService,
     private authService: AuthService, private touAuthService: TourAuthoringService, private router: Router) {

    
     }


   
   
  private initMap(): void {
    this.map = L.map(this.mapId, {
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
   /* let DefaultIcon = L.icon({
      iconUrl: 'assets/icons/keypointmark.svg',
      iconSize: [40, 40],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    L.Marker.prototype.options.icon = DefaultIcon;*/
    this.initMap();

    if (this.showEncounters) {
      this.showEncounterOnMap();
    }

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
  
      if(this.tourSearchActivated)
      {
        this.getCurrentPosition();
        this.registerOnSearchClick();
      }
      if(this.showingTour)
      {  
  
        
       /* if (!this.selectedTourPoints || this.selectedTourPoints.length === 0) {
          console.warn('No key points available to drawwwww.');
          return; // Izlazi ako nema key pointova
        }*/
         this.setRoute(this.selectedTourPoints); //xd
       //  alert(this.selectedTourPoints.length);
         console.log("Kljucne tacke poslate:");
         console.log(this.selectedTourPoints);
         console.log("SHOWING ROUTES");
        // this.drawRoute(this.selectedTourPoints);
      }
     
      
      if(this.positionSimulatorActivated)
      {
        
        this.getCurrentPosition();
        this.registerPosition();
      }

      if(this.showingFirstKp)
       {
        
        this.showFirstKeypoint(this.tourOverview.firstKeyPoint);
       }
    this.plotKeyPoints();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
        if (changes['selectedTourPoints']) {
            this.plotKeyPoints(); 
        }
        if (changes['selectedObjectPoints']) {
            this.plotExistingObjects(); 
        }
        if (changes['selectedEncounterPoints']) {
          console.log("Novi encounter-i za prikaz na mapi:", this.selectedEncounterPoints);
          this.showEncounterOnMap();
        }
    }
}

  showPoint() : void
  {
    this.currentMarker = new L.Marker([this.selectedKeypoint.latitude, this.selectedKeypoint.longitude], {icon: this.keypointIcon}).addTo(this.map);
  }

  async showFirstKeypoint(point: KeyPoint) : Promise<void>
  {
    this.currentMarker = new L.Marker([point.latitude, point.longitude], {icon: this.keypointIcon}).addTo(this.map);
    const address = await this.getAddress(point.latitude, point.longitude);
    console.log(address);
    const popupContent = `
   <div class="card" style="width: 14vw; max-height: 30vh; height: auto; border-radius: 15px; overflow: hidden; transition: transform 0.3s ease; cursor: pointer; background: radial-gradient(circle, rgb(241, 226, 251), rgb(253, 248, 255));">
  <div class="imgContainer" style="width: 100%; height: 120px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
    <img src="${this.getImage(point.image)}" alt="Item Image" style="width: 100%; height: 100%; object-fit: contain;">
  </div>

      <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div class="card-header" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: auto;">
          <div class="card-title" style="font-size: 1.2em; margin-top: 0.7vh; margin-bottom: 3px; font-weight: bold; color: #5D4F6A; text-align: center;">
            ${point.name}
          </div>
          <div class="card-footer-description" style="font-size: 0.9em; line-height: 1.4; color: #777;  text-align: center; overflow: hidden;">
            ${point.description}
          </div>
        </div>
  
       <div class="card-footer">
          <div class="card-footer-item" style="
            font-size: 0.8em; 
            color: #6A515E; 
            display: flex; 
            flex-direction: column; 
            margin-left: 1vh; 
            margin-right: 1vh; 
            justify-content: center; 
            align-items: center;">
      
          <!-- Naslov "Address" -->
          <p style="font-weight: bold; margin-bottom: 0.5em;">Address</p>
          
          <!-- Prikaz adrese -->
          <p style="margin: 0; text-align: center;">${address || 'Loading address...'}</p>
        </div>
      </div>
    </div>`;
    this.currentMarker.bindPopup(popupContent).openPopup();
  }


  showCurrentPosition(longitude: number, latitude: number){
    
    this.currentMarker = new L.Marker([latitude, longitude], {icon: this.positionIcon}).addTo(this.map);
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

      this.currentMarker = new L.Marker([lat, lng], {icon: this.keypointIcon}).addTo(this.map);
      
      this.latitudeChanged.emit(lat);
      this.longitudeChanged.emit(lng);
    });
    this.plotExistingObjects();
  }

  registerOnSearchClick(): void {
    
   
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

      this.currentMarker = new L.Marker([lat, lng], {icon: this.positionIcon}).addTo(this.map);
      
      this.tourSearchLat.emit(lat);
      this.tourSearchLon.emit(lng);
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

      this.currentMarker = new L.Marker([lat, lng], {icon: this.positionIcon}).addTo(this.map);
      
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
    console.log('setRoute called with keyPoints:', keyPoints);
   // console.log("Setting route!");
   // console.log("tacke iz setRoute:");
   // console.log(keyPoints);
    const waypoints = keyPoints.map(point => L.latLng(point.latitude, point.longitude));
    const routeControl = L.Routing.control({
      waypoints: waypoints,
      router: L.routing.mapbox('pk.eyJ1IjoidmVsam9vMDIiLCJhIjoiY20yaGV5OHU4MDFvZjJrc2Q4aGFzMTduNyJ9.vSQUDO5R83hcw1hj70C-RA', {profile: 'mapbox/walking'}),
      lineOptions: {
        styles: [{ color: '#17097cff', opacity: 0.7, weight: 5 }],
        extendToWaypoints: true,            // Default value
        missingRouteTolerance: 0.1,         // Default tolerance for missing routes
        addWaypoints: false    
      },
      createMarker: () => null
      

    } as any).addTo(this.map);
   
  /*  routeControl.on('routesfound', function(e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    });*/

    routeControl.on('routesfound', (e) => { 
      const routes = e.routes;
      const summary = routes[0].summary;
      const totalDistance = summary.totalDistance / 1000;
      console.log("Id ture u map komponent"+ keyPoints[0].tourId);
  
     
      this.touAuthService.updateTourDistance(keyPoints[0].tourId,totalDistance).subscribe({
        next: (result) => {
          
          
          this.distanceChanged.emit(totalDistance);
          this.mapService.updateDistance({distance: totalDistance, tourId: keyPoints[0].tourId})
          
          console.log("emit se desio");     
            
        },
        error: () => {   
          console.log("uslo u eror");  
        },
      });

      //alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' +            Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    });

    // routeControl.on('routesfound', function(e) {
    //   var routes = e.routes;
    //   var summary = routes[0].summary;
    //   alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    // });
  }
  /*
  private plotExistingObjects(): void {
    this.objects.forEach((obj: TourObject) => {
      L.marker([obj.latitude, obj.longitude], { icon: this.redIcon })
        .addTo(this.map)
        .bindPopup(`<strong>${obj.name}</strong><br>${obj.description}`);
    });
  }
    */

  private plotExistingObjects(): void {

    
    
    this.selectedObjectMarkers?.forEach(marker => this.map.removeLayer(marker));
    this.selectedObjectMarkers = [];
    
    if (this.selectedObjectPoints && this.selectedObjectPoints.length > 0) {
        this.selectedObjectPoints.forEach(async (obj: TourObject) => {
            const iconForThisCategory = this.getObjectIcon(obj.category);

            const marker = L.marker([obj.latitude, obj.longitude], { icon: iconForThisCategory })
              .addTo(this.map);

            const address = await this.getAddress(obj.latitude, obj.longitude);

            const popupContent = `
                <div class="card" style="width: 14vw; max-height: 30vh; height: auto; border-radius: 15px; overflow: hidden; transition: transform 0.3s ease; cursor: pointer; background: radial-gradient(circle, rgb(241, 226, 251), rgb(253, 248, 255));">
                    <div class="imgContainer" style="width: 100%; height: 130px; overflow: hidden;">
                        <img src="${this.getImage(obj.image)}" alt="Object Image" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
                    </div>
                    <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
                        <div class="card-header" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: auto;">
                            <div class="card-title" style="font-size: 1.2em; margin-top: 0.7vh; margin-bottom: 3px; font-weight: bold; color: #5D4F6A; text-align: center;">
                                ${obj.name}
                            </div>
                            <div class="card-footer-description" style="font-size: 0.9em; line-height: 1.4; color: #777; text-align: center; overflow: hidden;">
                                ${obj.description}
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="card-footer-item" style="font-size: 0.8em; color: #6A515E; display: flex; justify-content: center;">
                                <p><strong>Address:</strong> ${address || 'Loading address...'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add hover interaction for showing and hiding popups
            marker.on('mouseover', () => {
                marker.bindPopup(popupContent).openPopup();
            });

            marker.on('mouseout', () => {
                marker.closePopup();
            });
            marker.on('click', () => {
              this.objectClicked.emit(obj); // obj is a TourObject
            });
            

            // Save the marker for future updates or clearances
            this.selectedObjectMarkers.push(marker);
        });
    } else {
        console.warn('No existing objects to plot.');
    }
  }

  drawRoute(keyPoints: KeyPoint[]): void{
    keyPoints.forEach(keyPoint =>{
      const newMarker = L.marker([keyPoint.latitude, keyPoint.longitude], {icon: this.keypointIcon}).addTo(this.map);
    });
  }

  getImage(image: string)
  {
    return environment.webroot + image;
  }

private async showEncounterOnMap(): Promise<void> {
  console.log("Showing encunters in radius");
  console.log("Selected Encounter Points:", this.selectedEncounterPoints); 
  this.selectedEncounterMarkers.forEach(marker => this.map.removeLayer(marker));
  this.selectedEncounterMarkers = [];

  if (this.selectedEncounterPoints && this.selectedEncounterPoints.length > 0) {
    this.selectedEncounterPoints.forEach(async point => {
      const marker = L.marker([point.latitude, point.longitude], {icon: this.encounterMarker})
      .addTo(this.map);

      const address = await this.getAddress(point.latitude, point.longitude);

      const popupContent = `
        <div class="card" style="width: 14vw; max-height: 30vh; height: auto; border-radius: 15px; overflow: hidden; transition: transform 0.3s ease; cursor: pointer; background: radial-gradient(circle, rgb(241, 226, 251), rgb(253, 248, 255));">
          <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between; padding: 10px;">
            <div class="card-header" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: auto;">
              <div class="card-title" style="font-size: 1.2em; margin-top: 0.7vh; margin-bottom: 3px; font-weight: bold; color: #5D4F6A; text-align: center;">
                ${point.title}
              </div>
              <div class="card-footer-description" style="font-size: 0.9em; line-height: 1.4; color: #777; text-align: center; overflow: hidden;">
                ${point.description}
              </div>
            </div>

            <!-- Conditionally display the image if the type is HiddenLocation -->
            ${point.type === EncounterType.HiddenLocation ? `
              <div class="card-image" style="text-align: center; margin-top: 10px;">
                <img src="${point.hiddenLocationData?.imageUrl}" alt="Hidden Location" style="width: 100%; border-radius: 10px;">
              </div>
            ` : ''}

            <div class="card-footer" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 10px;">
              <div class="card-footer-item" style="font-size: 0.9em; color: #6A515E; display: flex; justify-content: center; margin-top: 5px;">
                <p><strong>Type:</strong> ${EncounterType[point.type]}</p>
              </div>
              <div class="card-footer-item" style="font-size: 0.9em; color: #6A515E; display: flex; justify-content: center; margin-top: 5px;">
                <p><strong>Status:</strong> ${EncounterStatus[point.status]}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      marker.on('mouseover', () => {
        marker.bindPopup(popupContent).openPopup();
      });

      marker.on('mouseout', () => {
        marker.closePopup();
      });
      this.selectedEncounterMarkers.push(marker);
    })
  }
}

  private async plotKeyPoints(): Promise<void> {
    console.log('Selected Tour Points:', this.selectedTourPoints);
    // Clear existing markers if re-plotting is needed
    this.selectedTourPointsMarkers.forEach(marker => this.map.removeLayer(marker));
    this.selectedTourPointsMarkers = [];

    if (this.selectedTourPoints && this.selectedTourPoints.length > 0) {
      this.selectedTourPoints.forEach(async point => {
        const marker = L.marker([point.latitude, point.longitude], {icon: this.keypointIcon})
          .addTo(this.map);

          
          const address = await this.getAddress(point.latitude, point.longitude);

          // Bind popup content without immediately opening it
          const popupContent = `
  <div class="card" style="width: 14vw; max-height: 30vh; height: auto; border-radius: 15px; overflow: hidden; transition: transform 0.3s ease; cursor: pointer; background: radial-gradient(circle, rgb(241, 226, 251), rgb(253, 248, 255));">
    <div class="imgContainer" style="width: 100%; height: 130px; overflow: hidden;">
      <img src="${this.getImage(point.image)}" alt="Item Image" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
    </div>

    <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div class="card-header" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: auto;">
        <div class="card-title" style="font-size: 1.2em; margin-top: 0.7vh; margin-bottom: 3px; font-weight: bold; color: #5D4F6A; text-align: center;">
          ${point.name}
        </div>
        <div class="card-footer-description" style="font-size: 0.9em; line-height: 1.4; color: #777;  text-align: center; overflow: hidden;">
          ${point.description}
        </div>
      </div>

      <div class="card-footer">
        <div class="card-footer-item" style="font-size: 0.8em; color: #6A515E; display: flex; margin-left: 1vh; margin-right: 1vh; justify-content: center;">
          <p><strong>Address:</strong> ${address || 'Loading address...'}</p>
        </div>
      </div>

        <div class = "card-btn" style="display: flex; justify-content: center;">
     
      </div>

    </div>
  </div>
      `;
  


    
      marker.bindTooltip(popupContent, {
        direction: 'top',    // or 'auto', 'right', etc.
        sticky: true         // keep the tooltip open if the cursor drifts slightly
      });
      
        this.selectedTourPointsMarkers.push(marker)
        

        
      });
      
      
      this.setRoute(this.selectedTourPoints)
    } else {
      console.warn('No key points available to plot.');
    }
}

  
  
  refreshPage():void{
    window.location.reload();
  }

  private async getAddress(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      
      // Extract the house number and street
      const { house_number, road } = data.address || {};
  
      // Format the address with street and house number
      if (road && house_number) {
        return `${road} ${house_number} `;
      } else if (road) {
        return `${road}`;
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    }
  }
  public removeCurrentMarker() {
    if(this.currentMarker){
      this.map.removeLayer(this.currentMarker);
      this.currentMarker = null;
    }
  }
}
