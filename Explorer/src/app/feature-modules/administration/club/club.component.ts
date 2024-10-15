import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import {Club} from '../model/club.model';
@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {

  club:Club[]=[];
  constructor(private service:AdministrationService){}

  ngOnInit():void{
    // throw new Error('Method not implemented');
    this.service.getAllClubs().subscribe({
      next:(result:PagedResults<Club>)=>{
        this.club=result.results
      },
      error:(err:any)=>{
        console.log(err)
      }
    })
  }


}
