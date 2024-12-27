import { Component, ElementRef, HostListener, EventEmitter, Input, OnInit ,Output, ViewChild} from '@angular/core';
import {PublicStatus, TourObject, CategoryDTO} from '../model/object.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { MapComponent } from 'src/app/shared/map/map.component';


@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  @ViewChild('mapCmp') mapComponent: MapComponent;

  

  objects: TourObject[] = [];
  categories: CategoryDTO[] = [];
  selectedObject: TourObject | null = null;
  constructor(private service: TourAuthoringService, private authService: AuthService){}

  selectedLatitude: number | null = null;
  selectedLongitude: number | null = null;
  isFormVisible: boolean = false;
  isEditing = false;

  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  user: User | undefined;

  selectedFile: File | null = null;
  imageBase64: string;

  ngOnInit(): void {
    this.getObjects();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.service.getObjectCategories().subscribe({
      next: (data) => {
        this.categories = data
      },
      error: (err) => {
        console.error('Error fetching object categories!!', err);
      }
    
      
    })
  }

  objectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    longitude: new FormControl(0.0,Validators.required),
    latitude: new FormControl(0.0,Validators.required),
    description: new FormControl('',Validators.required),
    category: new FormControl(16,Validators.required),
    image: new FormControl(''),
    imageBase64: new FormControl(''),
    publicStatus: new FormControl(2,[Validators.required])
  })

  createObject(): void {
    if(this.objectForm.valid){
      const object: TourObject = {
        id: 0,
        name: this.objectForm.value.name || '',
        longitude: this.selectedLongitude || 0.0,
        latitude: this.selectedLatitude || 0.0,
        description: this.objectForm.value.description || '',
        category: this.objectForm.value.category || 0,
        image: this.objectForm.value.image || 'placeholder.jpg',
        imageBase64: this.objectForm.value.imageBase64 || '',
        userId: this.user?.id ?? -1,
        publicStatus: this.objectForm.value.publicStatus ?? 2,
      }
      this.service.addObject(object).subscribe({
        next: (createdObj: TourObject) => {
          this.getObjects();
          this.objectForm.reset();
          this.isFormVisible = false;
          this.mapComponent.removeCurrentMarker();
          console.log("Object created: " ,createdObj);
        }
      })
    }
  }

  getObjects(): void{
    
    this.service.getObjects().subscribe({
      next: (result: PagedResults<TourObject>) => {
        this.objects = result.results;
        this.objects = this.objects.sort((a, b) => {
          const idA = a?.id ?? 0; // If a.id is undefined, use 0 as a fallback
          const idB = b?.id ?? 0; // If b.id is undefined, use 0 as a fallback
          return idA - idB;
        }); 
        console.log(this.objects);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  updateLongitude(newLongitude: number): void{
    this.selectedLongitude = newLongitude;
    this.objectForm.patchValue({ longitude: newLongitude });
  }
  updateLatitude(newLatitude: number): void{
    this.selectedLatitude = newLatitude;
    this.objectForm.patchValue({ latitude: newLatitude });
  }
  editObject(item: TourObject): void{
    this.selectedObject = item;
  }  

  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isFormVisible=false;
    //this.adjustMap();
    //this.adjustForm(0);
  }
  // Metoda koja se pokreće na mouseup i proverava da li je reč o kliku
  onMouseUp(event: MouseEvent) {
    const endX = event.clientX;
    const endY = event.clientY;
  
    // Ako je razdaljina između start i end koordinata mala, tretiraj kao klik
    if (Math.abs(endX - this.startX) < 5 && Math.abs(endY - this.startY) < 5) {
      this.x = endX + 50 + window.scrollX;
      this.y = endY + 100 + window.scrollY - 200;
      this.isFormVisible = true;
      setTimeout(() => {
        this.adjustFormPosition();
      });
    }
  }
  
  //ako je kliknuto van mape zatvorice formu
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent){
    const target = event.target as HTMLElement;
    const isInsideMap = target.closest('.map-container');
    const isInsideForm = target.closest('.keypoint-form-div');
    const isOverlay = target.closest('.cdk-overlay-container');
    if (!isInsideMap && !isInsideForm && !isOverlay) {
      this.isFormVisible = false;
    }
  }
  private adjustFormPosition(): void {
    const formContainer = document.querySelector('.form-map-container') as HTMLElement;
    if (!formContainer) return;
  
    const formWidth = formContainer.offsetWidth;
    const formHeight = formContainer.offsetHeight;
  
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    // If the form goes beyond the right edge, shift it left
    if (this.x + formWidth > viewportWidth) {
      this.x = viewportWidth - formWidth - 10; 
    }
    // If it goes beyond the bottom edge, shift it up
    if (this.y + formHeight > viewportHeight) {
      this.y = viewportHeight - formHeight - 10;
    }
  
    // Prevent negative values in case user clicked at top-left corner
    if (this.x < 0) {
      this.x = 10;
    }
    if (this.y < 0) {
      this.y = 10;
    }
  }
  
  adjustMap(){
    const leafletTopDiv = document.querySelector('.leaflet-control-container') as HTMLElement;
    if (leafletTopDiv) {
        leafletTopDiv.style.display = 'none'; 
    }
  }
  onFileSelected(event: any){
    const file:File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        this.imageBase64 = reader.result as string;
        this.objectForm.patchValue({
          imageBase64: this.imageBase64
        });
    };
    reader.readAsDataURL(file); 
  }
  onObjectClicked(object: TourObject){
    this.isEditing = true;
    this.isFormVisible=true;
    this.selectedObject = object;

    this.objectForm.patchValue({
      name: object.name,
      longitude: object.longitude,
      latitude: object.latitude,
      description: object.description,
      category: object.category,
      image: object.image,
      imageBase64: object.imageBase64,
      publicStatus: object.publicStatus
    });
  }
  updateObject(): void{
    if (this.objectForm.valid && this.selectedObject) {
      const updatedObject: TourObject = {
        ...this.selectedObject, // preserve original id, userId, etc.
        name: this.objectForm.value.name || this.selectedObject.name,
        longitude: this.objectForm.value.longitude || this.selectedObject.longitude,
        latitude: this.objectForm.value.latitude || this.selectedObject.latitude,
        description: this.objectForm.value.description || this.selectedObject.description,
        category: this.objectForm.value.category || this.selectedObject.category,
        image: this.objectForm.value.image || this.selectedObject.image,
        imageBase64: this.objectForm.value.imageBase64 || '',
        publicStatus: this.objectForm.value.publicStatus || 2
      };
  
      this.service.updateObject(updatedObject).subscribe({
        next: (res: TourObject) => {
          console.log('Object updated: ', res);
          this.getObjects();
          this.onCancelEdit();
        },
        error: (err) => {
          console.error('Error updating object', err);
        }
      });
    }
  }
  onCancelEdit(): void {
    this.objectForm.reset();
    this.isEditing = false;
    this.isFormVisible = false;
    this.selectedObject = null;
  }
  
}
