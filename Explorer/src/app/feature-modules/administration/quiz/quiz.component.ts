import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkDragMove, CdkDropList } from '@angular/cdk/drag-drop';
import { environment } from 'src/env/environment';
import { TourPreferenceService } from '../../tour-authoring/tour-preference.service';
import { TourPreference } from 'src/app/shared/model/tour-preference.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})

//npm install @angular/cdk

export class QuizComponent implements AfterViewInit {
  @ViewChild('customTourList', { static: false }) customTourList!: CdkDropList;
  @ViewChild('stepsContainer', { static: false }) stepsContainer!: ElementRef;
  @ViewChild('carouselContainer', { static: false }) container!: ElementRef;
  @ViewChild('title', {static: false}) title!: ElementRef; 
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;

  slides = [0, 1, 2, 3, 4]; 
  currentSlideIndex = 0; 
  selectedPicture = '';
  imagesPool: string[] = ['day.png', 'night.jpg']; 
  currentPoolIndex: number = 0;
  lightbulbImages : string[] = ['off.png', 'on.png'];
  els = document.getElementsByClassName('step') as HTMLCollectionOf<HTMLElement>;
  steps: HTMLElement[] = [];
  isSelectOptionCalled: boolean = false;
  isNextSlideCalled: boolean = false;

  selectedTags: string[] = [];
  showDescription: boolean = true;
  isStickerInside: {[key: string]: boolean} = {};

  isQuizCompleted: boolean = false; 
  saveSuccess: boolean = false; 
  showFailureFeedback: boolean = false; 

  currentImageIndex = 0; 
  images = ['self_guide1.png', 'guide_tour.png']; 
  descriptions = [
    "Explore alone, finding your path and creating unique memories.",
    "Join a guided tour and discover hidden gems with a group."
  ];
  images1 = ['solo_car.png', 'family_car1.png']; 
  descriptions1 = [
    "Explore on your own, embracing the freedom of solo travel.",
    "Travel with friends or family, sharing unforgettable moments together."
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
  get currentDescription5(): string {
    return this.descriptions1[this.currentImageIndex];
  }
  get currentImage5(): string {
    return this.images1[this.currentImageIndex];
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
  nextButtonWheel(direction: string): void {
    const wheel = document.querySelector('.steering-wheel') as HTMLElement;
  
    if (wheel) {
      wheel.classList.remove('clicked'); 
      void wheel.offsetWidth;  // Forcing reflow
      wheel.classList.add('clicked'); 
    }
  
    // Prvo primeni animaciju izlaska na trenutnu sliku
    this.animationClass = 'slide-out-left';  
  
    // Nakon što je animacija izlaska završena, promeni sliku i dodaj animaciju za ulazak nove slike
    setTimeout(() => {
      // Menjamo sliku
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images1.length;  // Na sledeću sliku
  
      // Primeni animaciju za ulazak nove slike
      this.animationClass = 'slide-in-left'; 
    }, 500);  // Početak animacije ulaska nakon 500ms, koliko traje izlazna animacija
  
    // Osveži opis
    this.setDescriptionAnimation();
  
    console.log('Current Image:', this.currentImage5);
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
      this.selectedTagList = this.selectedTagList.filter(tag => tag !== 13 && tag!=3); 
      this.selectedTagList.push(14); 
    } else if (selectedImage === 'guide_tour.png') {
      this.selectedTagList = this.selectedTagList.filter(tag => tag !== 14 && tag!=3); 
      this.selectedTagList.push(13); 
    }
  
    console.log(`Selected tags: ${this.selectedTagList}`);
    
    this.nextSlide();
  }
  selectOptionSlide5(): void {
    const selectedImage = this.images1[this.currentImageIndex];
  
    if (selectedImage === 'solo_car.png') {
      console.log("no tags");
    } else if (selectedImage === 'family_car1.png') {
      // this.selectedTagList = this.selectedTagList.filter(tag => tag !== 14 && tag!=3); 
      this.selectedTagList.push(3); 
    }
  
    console.log(`Selected tags: ${this.selectedTagList}`);
    
    // this.nextSlide();
  }
  
  

  selectedTagList: number[]=[];

  get currentPoolImage(): string {
    return this.imagesPool[this.currentPoolIndex];
  }
  get currentLightbulbImage(): string {
    // Obrnuto stanje u odnosu na `currentImage`
    return this.lightbulbImages[(this.currentPoolIndex + 1) % this.lightbulbImages.length];
  }

  toggleImage(): void {
    this.currentPoolIndex = (this.currentPoolIndex + 1) % this.imagesPool.length; // Prebacivanje između slika
  }

  constructor(private tourPreferenceService: TourPreferenceService, private router: Router) { }
  ngOnInit(): void {
    localStorage.removeItem('picture');
this.currentImageIndex = 0;
    const savedImageName = localStorage.getItem('picture');
    console.log(`Učitana slika iz localStorage: ${savedImageName}`);
    if (savedImageName) {
      this.selectedPicture = savedImageName;
      this.highlightSelectedImage(savedImageName);
    }
  
    document.querySelectorAll('.carousel-item1').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
   
        document.querySelectorAll('.carousel-item1').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item2').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item3').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item4').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
  
       
        (wrapper as HTMLElement).classList.add('clicked');
        const imageName = (wrapper as HTMLElement).getAttribute('data-image-name')!;
         localStorage.setItem('picture', imageName);
      });
    });
    document.querySelectorAll('.carousel-item2').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        
        document.querySelectorAll('.carousel-item1').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item2').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item3').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item4').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
  
       
        (wrapper as HTMLElement).classList.add('clicked');
        const imageName = (wrapper as HTMLElement).getAttribute('data-image-name')!;
         localStorage.setItem('picture', imageName);
      });
    });
    document.querySelectorAll('.carousel-item3').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        
        document.querySelectorAll('.carousel-item1').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item2').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item3').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item4').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
  
       
        (wrapper as HTMLElement).classList.add('clicked');
        const imageName = (wrapper as HTMLElement).getAttribute('data-image-name')!;
         localStorage.setItem('picture', imageName);
      });
    });
    document.querySelectorAll('.carousel-item4').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        
        document.querySelectorAll('.carousel-item1').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item2').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item3').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
        document.querySelectorAll('.carousel-item4').forEach(el => {
          (el as HTMLElement).classList.remove('clicked');
        });
  
       
        (wrapper as HTMLElement).classList.add('clicked');
        const imageName = (wrapper as HTMLElement).getAttribute('data-image-name')!;
         localStorage.setItem('picture', imageName);
      });
    });
    console.log(this.selectedTags);
  
  }

  highlightSelectedImage(imageName: string): void {
    
    document.querySelectorAll('.carousel-item1').forEach(wrapper => {
      wrapper.classList.remove('clicked');
    });
    document.querySelectorAll('.carousel-item2').forEach(wrapper => {
      wrapper.classList.remove('clicked');
    });
  
    const selectedWrapper = document.querySelector(`.image-wrapper[data-image-name="${imageName}"]`);
    if (selectedWrapper) {
      selectedWrapper.classList.add('clicked');
    }
  }
  addToSelectedTagListForKeyword(keyword: string, tagNumber: number): void {
    const hasKeyword = this.selectedTags.some(tag => tag.includes(keyword));
    if (hasKeyword && !this.selectedTagList.includes(tagNumber)) {
      this.selectedTagList.push(tagNumber);
    }
  }
  closeFailureFeedback(): void {
    this.showFailureFeedback = false; 
  }
  
  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
      this.progress(this.currentSlideIndex);
  
      // Logika za Slide 1
      if (this.currentSlideIndex === 1) {
        const image = localStorage.getItem('picture');
        if (!image) {
          // Swal.fire({
          //   icon: 'warning',
          //   title: 'Oops...',
          //   text: 'You need to choose one picture before we continue!',
          //   confirmButtonText: 'OK'
          // });
          // this.currentSlideIndex--;
          this.showFailureFeedback = true; // Dodajemo kontrolni flag za prikaz kartice
          this.currentSlideIndex--;
          return;
        }
        if (image === 'beach.jpg') {
          this.selectedTagList = this.selectedTagList.filter(num => num !== 4 && num !== 5 && num !== 1);
          this.selectedTagList.push(10);
        } else if (image === 'city.png') {
          this.selectedTagList = this.selectedTagList.filter(num => num !== 4 && num !== 10 && num !== 1);
          this.selectedTagList.push(5);
        } else if (image === 'forest1.jpg') {
          this.selectedTagList = this.selectedTagList.filter(num => num !== 10 && num !== 5 && num !== 1);
          this.selectedTagList.push(4);
        } else if (image === 'museum-background.jpg') {
          this.selectedTagList = this.selectedTagList.filter(num => num !== 10 && num !== 5 && num !== 4);
          this.selectedTagList.push(1);
        }
      }
  
      // Logika za stikere (Slide 2)
      if (this.currentSlideIndex === 2) {
        this.addToSelectedTagListForKeyword('cycling', 0);
        this.addToSelectedTagListForKeyword('painting', 1);
        this.addToSelectedTagListForKeyword('historical', 6);
        this.addToSelectedTagListForKeyword('vibe', 7);
        this.addToSelectedTagListForKeyword('wildlife', 8);
        this.addToSelectedTagListForKeyword('photography', 12);
      }
  
      // Logika za Slide 3 - preuzima selectOption
      if (this.currentSlideIndex === 3) {
        const selectedImage = this.images[this.currentImageIndex];
        if (selectedImage === 'self_guide1.png') {
          this.selectedTagList = this.selectedTagList.filter(tag => tag !== 13 && tag !== 3);
          this.selectedTagList.push(14);
        } else if (selectedImage === 'guide_tour.png') {
          this.selectedTagList = this.selectedTagList.filter(tag => tag !== 14 && tag !== 3);
          this.selectedTagList.push(13);
        }
      }
  
      // Logika za Slide 4
      if (this.currentSlideIndex === 4) {
        if (this.currentPoolIndex === 0) {
          this.selectedTagList = this.selectedTagList.filter(num => num !== 9);
          this.selectedTagList.push(7);
        } else {
          this.selectedTagList = this.selectedTagList.filter(num => num !== 7);
          this.selectedTagList.push(9);
        }
      }
  
      console.log(this.selectedTagList);
    } else {
      // Poslednji slajd - čuvanje preferenci
      console.log('Čuvam podatke...');
      this.selectOptionSlide5();
  
      const preference: TourPreference = {
        weightPreference: 1,
        walkingRating: 1,
        bikeRating: 1,
        carRating: 1,
        boatRating: 1,
        id: 0,
        tags: this.selectedTagList,
        touristId: 0
      };
  
      this.tourPreferenceService.savePreference(preference).subscribe(
        (response) => {
          console.log('Preference saved successfully', response);
          this.saveSuccess = true;
          this.isQuizCompleted = true;
        },
        (error) => {
          console.error('Error saving preference', error);
          this.saveSuccess = false;
          this.isQuizCompleted = true;
        }
      );
    }
  }
  navigateToClubs(): void {
    this.router.navigate(['/club']);
  }
  
  navigateToHome(): void {
    this.router.navigate(['/']);
  }
  retrySave(): void {
    this.isQuizCompleted = false;
    this.nextSlide(); 
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
    //const container = document.getElementById('carousel-container');
    this.selectedPicture = imageName;
    console.log(`Selektovana slika: ${this.selectedPicture}`);
    localStorage.setItem('picture', this.selectedPicture);
    if(this.container !==null){

      this.container.nativeElement.classList.toggle('no-hover');
    }
    else{
    }
    
  }

  private tryPlayVideo(videoElement: HTMLVideoElement): void {
    videoElement.play().then(() => {
      console.log('Video started playing successfully.');
    }).catch((error) => {
      console.warn('Video autoplay blocked. Retrying...', error);

      // Ponovni pokušaj nakon kašnjenja
      setTimeout(() => {
        videoElement.play().catch((retryError) => {
          console.error('Video still cannot play automatically:', retryError);
        });
      }, 1000);
    });
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
    if (this.backgroundVideo) {
      const videoElement = this.backgroundVideo.nativeElement;

      // Proveri mute atribut
      if (!videoElement.muted) {
        videoElement.muted = true;
        console.log('Muted attribute added.');
      }

      // Resetuj video na početak i pokušaj da ga reprodukuješ
      videoElement.currentTime = 0;
      this.tryPlayVideo(videoElement);
    } else {
      console.error('Video element is not defined!');
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
    console.log(dragElement);
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
        this.isStickerInside[dragElement.id] = true;
      }
      //cycling 
      if(dragElement.id.includes('cyc')){
        this.selectedTagList = this.selectedTagList.filter(num => num !== 0);
        this.selectedTagList.push(0);
      }
      //wildlife 
      //if(dragElement.id.includes())
      
    } else {
      console.log('Element nije unutar custom-tour kontejnera');
      const index = this.selectedTags.indexOf(dragElement.id);
      this.isStickerInside[dragElement.id] = false;
      if (index !== -1) {
        //ako postoji, izbaci ga
        this.selectedTags.splice(index, 1);
      }
      if(dragElement.id.includes('cyc')){
        this.selectedTagList = this.selectedTagList.filter(num => num !== 0);
      }
    }
  }

  submitPreferences(): void{
    //alert(this.selectedTags);
    alert(this.selectedTagList)
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
