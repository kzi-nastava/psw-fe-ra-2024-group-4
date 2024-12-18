import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleComponent } from './bubble/bubble.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';



@NgModule({
  declarations: [
    BubbleComponent,
    ChatBotComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ChatBotModule { }
