import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import {Club} from '../model/club.model';
import { ClubJoinRequest } from '../model/club-join-request.model';
@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {

  club:Club[]=[];
  clubJoinRequests: ClubJoinRequest[] = [];
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

  addClubJoinRequest(club: any){
    console.log(club);

    const clubJoinRequest: ClubJoinRequest = {
      userId : 1, //To-do : currentUser.id
      clubId : club.id,
      status : 0
    }

    console.log(clubJoinRequest);
    //problem kod automatskog podesavanja id-a
    /*this.service.addClubJoinRequest(clubJoinRequest).subscribe({
      next: (_) =>{
        console.log('uspesno');
      }
    })*/

  }




}
