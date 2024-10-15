import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-club-details',
  templateUrl: './club-details.component.html',
  styleUrls: ['./club-details.component.css']
})
export class ClubDetailsComponent implements OnInit{

  constructor(private service: AdministrationService){}

   ngOnInit(): void {
       throw new Error('fg');
   }
}
