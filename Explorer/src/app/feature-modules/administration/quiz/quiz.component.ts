import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkDragMove, CdkDropList } from '@angular/cdk/drag-drop';
import { environment } from 'src/env/environment';
import { TourPreferenceService } from '../../tour-authoring/tour-preference.service';
import { TourPreference } from 'src/app/shared/model/tour-preference.model';
@Component({
  selector: 'xp-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})

//npm install @angular/cdk

export class QuizComponent implements AfterViewInit {
  @ViewChild('customTourList', { static: false }) customTourList!: CdkDropList;
  @ViewChild('stepsContainer', { static: false }) stepsContainer!: ElementRef;
  slides = [0, 1, 2, 3, 4]; 
  currentSlideIndex = 0; 
  selectedPicture = '';
  els = document.getElementsByClassName('step') as HTMLCollectionOf<HTMLElement>;
  steps: HTMLElement[] = [];

  selectedTags: string[] = [];
  showDescription: boolean = true;

  currentImageIndex = 0; 
  images = ['self_guide1.png', 'guide_tour.png']; 
  descriptions = [
    "Explore alone, finding your path and creating unique memories.",
    "Join a guided tour and discover hidden gems with a group."
  ];
  isSmallerImage(): boolean {
    return this.currentImageIndex === 1; 
  }
  
  
  get currentDescription(): string {
    return this.descriptions[this.currentImageIndex];
  }
  get currentImage(): string {
    return this.images[this.currentImageIndex];
  }
  
  animationClass: string = ''; 
  descriptionAnimationClass: string = ''; 
  setDescriptionAnimation(): void {
    this.descriptionAnimationClass = 'fade-in'; 
  
    setTimeout(() => {
      this.descriptionAnimationClass = '';
    }, 500); 
  }
  previousButton(direction: string): void {
    this.setAnimationClass(direction); 
    this.setDescriptionAnimation(); 
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.images.length - 1; 
    }
  }
  
  nextButton(direction: string): void {
    this.setAnimationClass(direction); 
    this.setDescriptionAnimation(); 
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0; 
    }
  }
  
  setAnimationClass(direction: string): void {
    if (direction === 'left') {
      this.animationClass = 'slide-in-left'; 
    } else if (direction === 'right') {
      this.animationClass = 'slide-in-right'; 
    }
  
    setTimeout(() => {
      this.animationClass = '';
    }, 500);
  }
  
  selectOption(): void {
    const selectedImage = this.images[this.currentImageIndex];
  
    if (selectedImage === 'self_guide1.png') {
      this.selectedTagList = this.selectedTagList.filter(tag => tag !== 13); 
      this.selectedTagList.push(14); 
    } else if (selectedImage === 'guide_tour.png') {
      this.selectedTagList = this.selectedTagList.filter(tag => tag !== 14); 
      this.selectedTagList.push(13); 
    }
  
    console.log(`Selected tags: ${this.selectedTagList}`);
    
    this.nextSlide();
  }
  
  

  selectedTagList: number[]=[];

  constructor(private tourPreferenceService: TourPreferenceService) { }
  ngOnInit(): void {
    
    const savedImageName = localStorage.getItem('picture');
    console.log(`Učitana slika iz localStorage: ${savedImageName}`);
    if (savedImageName) {
      this.selectedPicture = savedImageName;
      this.highlightSelectedImage(savedImageName);
    }
  
    document.querySelectorAll('.image-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
   
        document.querySelectorAll('.image-wrapper').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
  
       
        (wrapper as HTMLElement).classList.add('clicked');
        const imageName = (wrapper as HTMLElement).getAttribute('data-image-name')!;
         localStorage.setItem('picture', imageName);
      });
    });

  
  }

  highlightSelectedImage(imageName: string): void {
    
    document.querySelectorAll('.image-wrapper').forEach(wrapper => {
      wrapper.classList.remove('clicked');
    });
  
    const selectedWrapper = document.querySelector(`.image-wrapper[data-image-name="${imageName}"]`);
    if (selectedWrapper) {
      selectedWrapper.classList.add('clicked');
    }
  }
  
  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
      this.progress(this.currentSlideIndex);

      if(this.currentSlideIndex==1){
        const image = localStorage.getItem('picture');
        if(image== 'beach.jpg'){
          this.selectedTagList = this.selectedTagList.filter(num => num !== 4 && num!==5);
          this.selectedTagList.push(10);
        }else if(image=='download.png'){
          this.selectedTagList = this.selectedTagList.filter(num => num !== 4 && num!==10);
          this.selectedTagList.push(5);
        }else if(image =='forest1.jpg'){
          this.selectedTagList = this.selectedTagList.filter(num => num !== 10 && num!==5);
          this.selectedTagList.push(4);
        }
        console.log(this.selectedTagList);
      }
    }
    else{
      //this.currentSlideIndex=0;
      console.log('cuvaj');

      const preference: TourPreference = {
       
        weightPreference: 1,
        walkingRating: 1,
        bikeRating: 1,
        carRating: 1,
        boatRating: 1,
        id:0,
        tags: this.selectedTagList,
        touristId:0

      };
    
      this.tourPreferenceService.savePreference(preference).subscribe(
        (response) => {
          console.log('Preference saved successfully', response);
        },
        (error) => {
          console.error('Error saving preference', error);
        }
      );

    }
  }
  previousSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.progress(this.currentSlideIndex);
    }
    else{
      this.currentSlideIndex=4;
    }
  }
  
  getImage(image: string): string {
    return environment.webroot + "images/quiz/" + image;
  }
  selectPicture(imageName: string): void {
    this.selectedPicture = imageName;
    console.log(`Selektovana slika: ${this.selectedPicture}`);
    localStorage.setItem('picture', this.selectedPicture);
  }

  

  ngAfterViewInit() {
    // Ovdje možemo proveriti da li je customTourList dostupan nakon što se komponenta učita
    console.log('ngAfterViewInit - customTourList:', this.customTourList);
    
    // Osiguraj da je customTourList zaista učitan
    if (this.customTourList) {
      console.log('customTourList je dostupan:', this.customTourList.element.nativeElement);
    }
    if (this.stepsContainer) {
      this.steps = Array.from(this.stepsContainer.nativeElement.getElementsByClassName('step')) as HTMLElement[];

      // Dodajemo event listener na svaki korak
      this.steps.forEach((e) => {
        e.addEventListener('click', (x) => {
          //this.progress(x.target as HTMLElement);
        });
      });
    }
  }
  progress(stepElement: number): void {
    const stepNum = stepElement;
    const p = stepNum * 25;
    const percentElem = document.getElementsByClassName('percent')[0] as HTMLElement;
    percentElem.style.width = `${p}%`;

    this.steps.forEach((e: HTMLElement) => {
      const stepId = parseInt(e.id);

      if (stepId === stepNum) {
        e.classList.add('selected');
        e.classList.remove('completed');
      }
      if (stepId < stepNum) {
        e.classList.add('completed');
      }
      if (stepId > stepNum) {
        e.classList.remove('selected', 'completed');
      }
    });
  }


  // Stavke u srednjoj zoni (početno prazne)

  onDragMove(event: CdkDragMove<any>) {
    const { x, y } = event.pointerPosition;
    console.log(`Element moved to position: x=${x}, y=${y}`);
    // Uzimamo trenutnu poziciju dragovanog elementa
    const dragElement = event.source.getRootElement();
    const dragRect = dragElement.getBoundingClientRect();


    // Uzmi poziciju custom-tour kontejnera
    const containerRect = this.customTourList.element.nativeElement.getBoundingClientRect();

    // Provera da li je dragovani element unutar custom-tour kontejnera
    const isInside =
      dragRect.top >= containerRect.top - 50 &&
      dragRect.left >= containerRect.left  - 50 &&
      dragRect.bottom <= containerRect.bottom  + 50 &&
      dragRect.right <= containerRect.right  + 50;

    if (isInside) {
      console.log('Element je unutar custom-tour kontejnera');
      if(!this.selectedTags.includes(dragElement.id)){
        this.selectedTags.push(dragElement.id);
      }
    } else {
      console.log('Element nije unutar custom-tour kontejnera');
      const index = this.selectedTags.indexOf(dragElement.id);
      if (index !== -1) {
        //ako postoji, izbaci ga
        this.selectedTags.splice(index, 1);
      }
    }
  }

  submitPreferences(): void{
    alert(this.selectedTags);
  }
  // selectOption(): void {
  //   // Dohvati trenutno prikazanu opciju
  //   const currentOption = this.slides[this.currentSlideIndex];
  
  //   // Proveri da li je korisnik izabrao opciju (trenutni slajd)
  //   console.log(`Selected option for slide ${this.currentSlideIndex}:`, currentOption);
  
  //   // Dodaj trenutnu opciju u listu izabranih ako već nije izabrana
  //   if (!this.selectedTags.includes(`option-${currentOption}`)) {
  //     this.selectedTags.push(`option-${currentOption}`);
  //   }
  
  //   // Pokaži izabrane opcije (za testiranje, može se ukloniti kasnije)
  //   alert(`Selected options: ${this.selectedTags.join(', ')}`);
  // }
  
  
}
