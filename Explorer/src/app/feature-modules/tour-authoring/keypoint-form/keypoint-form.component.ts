import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { KeyPoint,PublicStatus } from '../model/keypoint.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../model/tour.model';
import { MapService } from 'src/app/shared/map/map.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';

@Component({
  selector: 'xp-keypoint-form',
  templateUrl: './keypoint-form.component.html',
  styleUrls: ['./keypoint-form.component.css']
})
export class KeypointFormComponent implements OnInit {
  keyPoints: KeyPoint[] = [];

  @Output() keypointsUpdated = new EventEmitter<null>();
  @Output() tourUpdated = new EventEmitter<Tour>();
  @Output() keypointAdded = new EventEmitter<KeyPoint>();
  @Output() keyPointCreated = new EventEmitter<void>();

  @Input() keypoint: KeyPoint;
  @Input() shouldEdit: boolean = false;
  @Input() shouldAddKeypoint: boolean = false;
  @Input() tourToAdd: Tour;
  @Input() tourKeyPoints: KeyPoint[];

  @Input() registeringObj: boolean = false;
  @Input() registerObjRoute: boolean = false;

  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  mapWidth = 700;  
  mapHeight = 600; 

  latitude: number = 0.0;
  longitude: number = 0.0;

  selectedFile: File | null = null;
  imageBase64: string;


  shouldEditKp: boolean = false;
  isFormVisible: boolean = false;


  user?: User | undefined;
  nextId: number = 0;
  constructor(private service: TourAuthoringService, private authService: AuthService, private mapService: MapService){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    if(this.user){
      this.service.getKeyPoints(this.user.id).subscribe({
        next: (result: KeyPoint[]) => {  this.keyPoints = result; },
        error: (err: any) => console.log(err)
      })
    }

    
    if(this.shouldEdit)
    {
     
      
      this.shouldEditKp = true;
      this.keypointForm.patchValue({
        name: this.keypoint.name,
        longitude: this.keypoint.longitude,
        latitude: this.keypoint.latitude,
        description: this.keypoint.description,
        image: this.keypoint.image,   
        publicStatus: this.keypoint.publicStatus,     
        imageBase64: this.keypoint.imageBase64
        
      })
    }

    

 
  }


 
  keypointForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    longitude: new FormControl(0.0, [Validators.required]),
    latitude: new FormControl(0.0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    imageBase64: new FormControl(''),
    publicStatus: new FormControl(PublicStatus.PRIVATE)
  })

  setLongitude(newLongitude: number): void{
    
    this.longitude = newLongitude;
    this.keypointForm.patchValue({
      longitude: newLongitude
    });
  }

  setLatitude(newLatitude: number): void{
  
    this.latitude = newLatitude;
    this.keypointForm.patchValue({
      latitude: newLatitude
    });
  }

  


  createKeyPoint(): void {
   

    if(this.user){
      this.service.getKeyPoints(this.user.id).subscribe({
        next: (result: KeyPoint[]) => { this.keyPoints = result; 

        },
        error: (err: any) => console.log(err)
      })

      this.service.getNextKeypointId(this.user.id).subscribe({
        next: (result: number) => {this.nextId = result;
          //alert(this.nextId);
        
    

      if(this.user)
      {
        
      console.log("ajsdas"+this.tourToAdd.id)
     
      const keypoint: KeyPoint = {

        id: this.nextId,
        name: this.keypointForm.value.name || "",
        longitude: this.keypointForm.value.longitude || 0.0,
        latitude: this.keypointForm.value.latitude || 0.0,
        description: this.keypointForm.value.description || "",
        image: this.keypointForm.value.image || "",
        userId: this.user.id || -1,
        imageBase64: this.keypointForm.value.imageBase64 || "" ,//ovde je bio problem
        tourId: this.tourToAdd.id || -1,
        publicStatus : Number(this.keypointForm.value.publicStatus),
      }
      

      console.log(this.keypointForm.value);
      this.service.createKeyPoint(keypoint).subscribe({
         next: (result: KeyPoint) => {
            this.keypointsUpdated.emit();
            this.tourToAdd.keyPoints.push(result);
            this.tourUpdated.emit(this.tourToAdd);
            this.keyPointCreated.emit();
            
          

         }
      });
    }

    }
  });


    }
  }
  onMakePublicChange(event: any): void {
    const isChecked = event.checked;
    this.keypointForm.patchValue({
      publicStatus: isChecked ? PublicStatus.REQUESTED_PUBLIC : PublicStatus.PRIVATE
    });
    console.log(isChecked)
    console.log(this.keypointForm.value.publicStatus)
  }

  updateKeyPoint(): void{
    
    if(this.user)
    {
      const keypoint: KeyPoint = {
        name: this.keypointForm.value.name || "",
        longitude: this.keypointForm.value.longitude || 0.0,
        latitude: this.keypointForm.value.latitude || 0.0,
        description: this.keypointForm.value.description || "",
        image: this.keypointForm.value.image || "",
        userId: this.user.id || -1,
        imageBase64: this.keypointForm.value.imageBase64 || "",//nisam dirala jer je update
        tourId: this.keypoint.tourId || -1, 
        publicStatus: Number(this.keypointForm.value.publicStatus) || 0, ///ovde ima errrorrr !!!!!!!!!!!!!!!!!!!!!!!!!!
        
      }
      keypoint.id = this.keypoint.id;
      console.log('Updated keypoint: ', keypoint);
      this.service.updateKeyPoint(keypoint).subscribe({
        next: () => {this.keypointsUpdated.emit(); 
                //alert("uslo");
              }

      });
    }
  
  }

 
  onFileSelected(event: any){
        const file:File = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            this.imageBase64 = reader.result as string;
            this.keypointForm.patchValue({
              imageBase64: this.imageBase64
            });
        };
        reader.readAsDataURL(file); 
}

onMouseDown(event: MouseEvent) {
  this.startX = event.clientX;
  this.startY = event.clientY;
  this.isFormVisible=false;
  this.adjustMap();
  this.adjustForm(0);
}

// Metoda koja se pokreće na mouseup i proverava da li je reč o kliku
onMouseUp(event: MouseEvent) {
  const endX = event.clientX;
  const endY = event.clientY;

  // Ako je razdaljina između start i end koordinata mala, tretiraj kao klik
  if (Math.abs(endX - this.startX) < 5 && Math.abs(endY - this.startY) < 5) {
    this.x = endX + 20 + window.scrollX;
    this.y = endY + 100 + window.scrollY - 200;
    this.isFormVisible = true;
    this.adjustForm(1);
  }
}

//ako je kliknuto van mape zatvorice formu
@HostListener('document:click', ['$event'])
onClick(event: MouseEvent){
  console.log(event);
  const target = event.target as HTMLElement;
  const isInsideMap = target.closest('.map-container');
  const isInsideForm = target.closest('.keypoint-form-div')
  if(!isInsideMap){
    this.isFormVisible = false;
  }
  if(isInsideForm){
    this.isFormVisible = true;
  }
}

adjustMap(){
  const leafletTopDiv = document.querySelector('.leaflet-control-container') as HTMLElement;
  if (leafletTopDiv) {
      leafletTopDiv.style.display = 'none'; 
  }
}

adjustForm(opacity: any){
  const form = document.querySelector('.form-map-container') as HTMLElement;
  if(form){
    form.style.opacity = opacity;
  }
 }
  

}
