import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkDragMove, CdkDropList } from '@angular/cdk/drag-drop';
import { environment } from 'src/env/environment';
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
  
    // Uklanjanje klase nakon animacije (500ms je trajanje animacije)
    setTimeout(() => {
      this.animationClass = '';
    }, 500);
  }
  
  selectOption(): void {
    alert(`You selected: ${this.images[this.currentImageIndex]}`);
  }
  

  
  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
      this.progress(this.currentSlideIndex);

    }
    else{
      this.currentSlideIndex=0;
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
