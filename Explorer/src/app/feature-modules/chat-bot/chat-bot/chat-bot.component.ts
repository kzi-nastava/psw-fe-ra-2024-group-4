import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatBotService } from '../chat-bot.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Message } from '../model/Message.model';

@Component({
  selector: 'xp-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatBotComponent implements OnInit {

  searchTerm: string = '';
  currentTag: string;
  previousTag: string;
  currentLevel: string[]
  answer: string;
  user: User;
  message: Message;
  currentQuestion: string;
  currentTitle: string = 'Questions';
  soundOn: boolean;

  speaker: SpeechSynthesisUtterance;

  constructor(private service: ChatBotService, private authService: AuthService){
    this.speaker = new SpeechSynthesisUtterance();
    this.speaker.lang = 'en-US';
  }
  ngOnInit(): void {

    this.soundOn = false;

    this.getQuestions("ROOT");   
    this.answer = "Hi, how can I help you?";

    this.playSound(this.answer);
    this.currentQuestion = "Welcome to the Chatbot"
    this.currentTag = "ROOT";
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      
    },
    (error) => {
      console.error("error");
    }
  );
    
  }

  ask(question:string){
  
    if(this.user)
    {
     
      this.service.getResponse(question, this.user.id).subscribe({
        next: (result) => {
          this.answer = result.message;
          this.currentQuestion = question;
          this.showNextSet(question);
          this.playSound(this.answer);
        
        },
        error: (err: any) => {
          console.error(err);
        }
      })
    }


  }

  getQuestions(tag: string){
    
  
    this.service.getQuestions(tag).subscribe({
      next: (result) => {
        this.currentLevel = result.questions;
        if (this.currentLevel.length === 0) {
          setTimeout(() => {
            this.goBack();
          }, 3000);}
      },
      error: (err: any) => {
        this.currentLevel = ["Error"];
      }
    });

  }

  showNextSet(question: string)
  {
    switch(question){
      case "Tours":
        this.getQuestions("TOURS");
        this.currentTag = "TOURS";
        this.currentTitle = "Tours";
        break;
      case "How to start a tour?":
        this.getQuestions("TOUR_EXECUTIONS");
        this.currentTag = "TOUR_EXECUTIONS";
        this.currentTitle = "Tour Executions";
        break;
      case "How to buy a tour?":
        this.getQuestions("TOUR_PURCHASE");
        this.currentTag="TOUR_PURCHASE";
        this.currentTitle = "Tour Purchase";
        break;
      case "How to use coupons?":
        this.getQuestions("COUPONS");
        this.currentTag="COUPONS";
        this.currentTitle = "Coupons";
        break;
      case "Blogs":
        this.getQuestions("BLOGS");
        this.currentTag = "BLOGS";
        this.currentTitle = "Blogs";
        break;
      default:
        this.currentTitle = "Questions";
    
    }
  }

  goBack()
  {
    switch(this.currentTag){
      case "TOURS":
        this.getQuestions("ROOT");
        this.currentTag = "ROOT";
        this.currentTitle = "Questions";
        break;
      case "TOUR_EXECUTIONS":
        this.getQuestions("TOURS");
        this.currentTag = "TOURS";
        this.currentTitle = "Tours";
        break;
      case "SEARCH":
        this.getQuestions(this.previousTag);
        this.currentTag = this.previousTag;

        break;
      case "TOUR_PURCHASE":
        this.getQuestions("TOURS");
        this.currentTag = "TOURS";
        this.currentTitle = "Tours";
        break;
      case "COUPONS":
        this.getQuestions("TOUR_PURCHASE");
        this.currentTag = "TOUR_PURCHASE";
        this.currentTitle = "Tour Purchase";
        break;
      case "BLOGS":
        this.getQuestions("ROOT");
        this.currentTag = "ROOT";
        this.currentTitle = "Questions";
        break;
    }
    if(this.currentTag==="ROOT"){
      this.answer = "Hi I am Gavrilo, how can I help you?";
    }
  }

  search()
  {
    
     const query = this.searchTerm;

     
     this.service.getSearchedQuestions(query).subscribe({
      next: (result) => {
        this.previousTag = this.currentTag;
        
        this.currentLevel = result.questions;
        this.currentTag = "SEARCH";

      },
      error: (err: any) => {
        this.currentLevel = ["Error"];
      }
     })
    
  }

  toggleSound()
  {
     
    this.soundOn = !this.soundOn;

    if(this.soundOn == false)
      window.speechSynthesis.cancel();
    else
      this.playSound(this.answer);

  }

  playSound(answer: string)
  {

    if(this.soundOn)
    {
      this.speaker.text = answer;
      window.speechSynthesis.speak(this.speaker);
    }

  }

}
