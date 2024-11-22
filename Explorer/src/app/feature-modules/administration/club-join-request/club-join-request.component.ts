import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { ClubJoinRequest } from '../model/club-join-request.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Club } from '../model/club.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PersonInfoService } from '../../person.info/person.info.service';
import { PersonInfo } from '../../person.info/model/info.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'xp-club-join-request',
  templateUrl: './club-join-request.component.html',
  styleUrls: ['./club-join-request.component.css']
})
export class ClubJoinRequestComponent implements OnInit {
  clubRequests: ClubJoinRequest[] = [];
  userClubRequests: ClubJoinRequest[] = [];
  clubs: Club[]=[];
  userClubIds: number[]=[];
  user: User | null = null;
  personNames: { [key: number]: string } = {};

  constructor(private service:AdministrationService,
    private authService: AuthService,
    private personInfoService: PersonInfoService){
      this.authService.user$.subscribe((user) => {
        this.user = user; 
        console.log(user); 
      });
};

  ngOnInit(): void {
    this.getRequests();
  }


  getRequests(): void{
    this.service.getClubJoinRequests().subscribe({
      next: (result: PagedResults<ClubJoinRequest>) => {
        this.clubRequests = result.results;
        console.log(result.results);
        this.getClubs();
        //this.filterRequestsForThisUser();
      },
      error: () => {
      }
    })
  }

  getClubs(): void{
    this.service.getAllClubs().subscribe({
      next:(result:PagedResults<Club>)=>{
        this.clubs=result.results;
        console.log(result.results);
        console.log('clubs:', this.clubs);
        this.getUserClubIds();
        this.filterRequestsForThisUser();


      },
      error:(err:any)=>{
        console.log(err)
      }
    });
  }

  getUserClubIds(){
    for(const club of this.clubs){
      if(club.id !== undefined && club.userId === this.user?.id){
        this.userClubIds.push(club.id);
      }
    }
  }

  filterRequestsForThisUser(){
    for(const request of this.clubRequests){
      if(this.userClubIds.includes(request.clubId)){
        this.userClubRequests.push(request);
        this.loadPersonName(request.userId);
      }
    }
    console.log(this.userClubRequests);
  }

  addMemberToClub(request: any){
    if(this.user !== null){
      this.service.addMember(request.userId, request.clubId, this.user.id).subscribe({
        next:()=>{
          console.log('Uspesno dodat member sa id ', request.userId, 'u klub sa id ', request.clubId);
        },
        error: () =>{
          console.log('Greska prilikom dodavanaja member sa id ', request.userId, 'u klub sa id ', request.clubId);
        }
      })
    }
  }


  acceptRequest(request: any){
    console.log(request);
    request.status = 1;
    this.service.updateClubJoinRequest(request).subscribe({
      next: ()=>{
        //uspesno prihvaceno
        if(this.user !== null){
          this.addMemberToClub(request);
        }
      },
      error: () => {

      }
    })
   // this.getRequests();
  }

  denyRequest(request: any){
    console.log(request);
    request.status = 2;
    this.service.updateClubJoinRequest(request).subscribe({
      next: ()=>{

      },
      error: () => {

      }
    })
    //this.getRequests();
  }

  getClubName(clubId: number){
    const club = this.clubs.find(cl => cl.id === clubId);
    return club?.name;
  }

  loadPersonName(userId: number): void {
    if (!this.personNames[userId]) {
      this.personInfoService.getTouristInfo(userId).subscribe({
        next: (result: PersonInfo) => {
          this.personNames[userId] = `${result.name} ${result.surname}`;
        },
        error: () => {
          this.personNames[userId] = "greska";
        }
      });
    }
  }

}