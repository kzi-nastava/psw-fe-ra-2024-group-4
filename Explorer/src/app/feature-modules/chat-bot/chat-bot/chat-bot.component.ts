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

  firstLevel: string[]
  toursLevel1: string[]
  currentLevel: string[]
  answer: string;
  user: User;
  message: Message;
  currentQuestion: string;

  constructor(private service: ChatBotService, private authService: AuthService){}
  ngOnInit(): void {

    this.firstLevel = ["About the app", "Tours", "Encounters"];
    this.toursLevel1 = ["How to start a tour?", "Where can I find tours?", "Back"]
    this.currentLevel = this.firstLevel;
    this.answer = "Hi, how can I help you?";
    this.currentQuestion = "Welcome to the Chatbot"
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
          if(question === "Tours")
            this.currentLevel = this.toursLevel1;
        },
        error: (err: any) => {
          console.error(err);
        }
      })
    }


  }

}
