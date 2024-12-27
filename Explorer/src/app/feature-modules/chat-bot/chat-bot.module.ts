import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleComponent } from './bubble/bubble.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BubbleComponent,
    ChatBotComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule

  ]
})
export class ChatBotModule { }
