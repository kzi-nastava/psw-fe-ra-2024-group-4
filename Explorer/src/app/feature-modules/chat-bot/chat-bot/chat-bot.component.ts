import { Component, OnInit } from '@angular/core';
import { ChatBotService } from '../chat-bot.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Message } from '../model/Message.model';

@Component({
  selector: 'xp-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {

  currentTag: string;
  previousTag: string;
  currentLevel: string[]
  answer: string;
  user: User;
  message: Message;
  currentQuestion: string;

  constructor(private service: ChatBotService, private authService: AuthService){}
  ngOnInit(): void {

    this.getQuestions("ROOT");   
    this.answer = "Hi, how can I help you?";
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
        break;
      case "How to start a tour?":
        this.getQuestions("TOUR_EXECUTIONS");
        this.currentTag = "TOUR_EXECUTIONS";
        break;
    }
  }

  goBack()
  {
    switch(this.currentTag){
      case "TOURS":
        this.getQuestions("ROOT");
        this.currentTag = "ROOT";
        break;
      case "TOUR_EXECUTIONS":
        this.getQuestions("TOURS");
        this.currentTag = "TOURS";
        break;
      case "SEARCH":
        this.getQuestions(this.previousTag);
        this.currentTag = this.previousTag;
        break;

    }

  }

  search()
  {
     const inputElement = document.getElementById("inputField") as HTMLInputElement;
     const query = inputElement.value;

     
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

}
