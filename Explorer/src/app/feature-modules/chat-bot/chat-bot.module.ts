import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleComponent } from './bubble/bubble.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [
    BubbleComponent,
    ChatBotComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule

  ]
})
export class ChatBotModule { }
