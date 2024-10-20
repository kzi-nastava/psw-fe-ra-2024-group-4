import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import {Club} from '../model/club.model';
import { ClubJoinRequest } from '../model/club-join-request.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { catchError } from 'rxjs';
@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {

  club:Club[]=[];
  user: User | null = null;
  clubJoinRequests: ClubJoinRequest[] = [];
  userRequestCache: { [key: number]: boolean } = {};
  userIsOwner: {[key: number]: boolean } = {};
  userIsMember: {[key: number]: boolean } = {};
  constructor(private service:AdministrationService,
              private authService: AuthService){
                this.authService.user$.subscribe((user) => {
                  this.user = user; 
                  console.log(user);
                  console.log(this.userRequestCache);
                  
                });
  };


  ngOnInit():void{
    console.log('on init requests: ', this.userRequestCache);
    // throw new Error('Method not implemented');
    this.service.getAllClubs().subscribe({
      next:(result:PagedResults<Club>)=>{
        this.club=result.results
        //this.populateUserRequestCache();
        this.onInitCacheFill();
      },
      error:(err:any)=>{
        console.log(err)
      }
    });
    this.getClubJoinRequests();
  }


  getClubJoinRequests(){
    this.service.getClubJoinRequests().subscribe({
      next: (result: PagedResults<ClubJoinRequest>) => {
        this.clubJoinRequests = result.results;
        this.populateUserRequestCache();
        console.log(result.results);
      },
      error: () => {
      }
    })
  }

  populateUserRequestCache() {
    this.onInitCacheFill();
    for (const request of this.clubJoinRequests) {
      if (request.clubId !== undefined && request.userId === this.user?.id) {
        // Zahtev je poslat i ceka se odgovor, moze da ga cancel
        if(request.status === 0){
          this.userRequestCache[request.clubId] = true;
        }
        //Zahtev je vec prihvacen, korisnik je member
        if(request.status === 1){
          this.userIsMember[request.clubId] = true;
        }
      }
    }
  }

  onInitCacheFill(){
    for(const club of this.club){
      console.log(club);
      if(club.id !== undefined){
        this.userRequestCache[club.id] = false;
      }
      if(club.id !== undefined && club.userId === this.user?.id){
        this.userIsOwner[club.id] = true;
      }
    }
    console.log('owner ovih klubova', this.userIsOwner);
    console.log('requestovi: ', this.userRequestCache);
  }

  addClubJoinRequest(club: any){
    console.log(club);

    const clubJoinRequest: ClubJoinRequest = {
      id : 0,
      userId : 0, //To-do : currentUser.id
      clubId : club.id,
      status : 0
    }
    if(this.user !== null){
      console.log(this.user.id);
      clubJoinRequest.userId = this.user.id;
    }
    console.log(this.userRequestCache);

    //console.log(clubJoinRequest);
    //console.log('rez:',this.userRequestExists(club));
    this.service.addClubJoinRequest(clubJoinRequest).subscribe({
      next: (_) =>{
        console.log('uspesno dodat request:', clubJoinRequest);
        this.getClubJoinRequests();
      },
      error:(err:any)=>{
        console.log(err)
      }
    })
    this.userRequestCache[club.id] = true;
    //this.populateUserRequestCache();

   // this.getClubJoinRequests();
  }

  cancelClubJoinRequest(club: any){
    console.log('hocemo delete', this.userRequestCache);
    //nadji id
    for (const request of this.clubJoinRequests) {
      if (request.id !== undefined && request.clubId !== undefined && request.clubId === club.id && request.userId === this.user?.id) {
        console.log('zelim da obrisem zahtev za klub sa id :', club.id, 'zahtev req id:', request.id);
        this.userRequestCache[request.clubId] = false;
        //obrisi za taj id
        this.service.deleteClubJoinRequest(request.id).subscribe({
          next: (_) =>{
            console.log('uspesno obrisano');
            this.getClubJoinRequests();
          },
          error:(err:any)=>{
            console.log(err)
          }
        })
      }
    }


    this.userRequestCache[club.id] = false;
   // this.getClubJoinRequests();
  
    //this.populateUserRequestCache();
  }





}
