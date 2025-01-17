import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'xp-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css'],
})
export class FirstPageComponent {
  @Output() scrollToTarget = new EventEmitter<void>();
  
 /* uttr: SpeechSynthesisUtterance;

  constructor(){
    this.uttr = new SpeechSynthesisUtterance();
    this.uttr.lang = 'en-US';
  }


  textToSpeech(): void {
 
    this.uttr.text = "Travel tales";
    window.speechSynthesis.speak(this.uttr);
    
  }*/
  
 }
