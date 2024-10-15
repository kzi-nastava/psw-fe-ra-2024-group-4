import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';

import { ClubJoinRequest } from '../model/club-join-request.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-club-join-request',
  templateUrl: './club-join-request.component.html',
  styleUrls: ['./club-join-request.component.css']
})
export class ClubJoinRequestComponent implements OnInit {
  clubRequests: ClubJoinRequest[] = [];

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getRequests();
  }


  getRequests(): void{
    this.service.getClubJoinRequests().subscribe({
      next: (result: PagedResults<ClubJoinRequest>) => {
        this.clubRequests = result.results;
        console.log(result.results);
      },
      error: () => {
      }
    })
  }


}