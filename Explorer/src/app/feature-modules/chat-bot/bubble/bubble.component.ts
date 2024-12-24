import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xp-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css']
})

export class BubbleComponent implements OnInit {

  @Input() answer: string;

   ngOnInit(): void {
     
   }

}
