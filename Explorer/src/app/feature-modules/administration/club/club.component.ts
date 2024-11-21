import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import {Club} from '../model/club.model';
import { ClubJoinRequest } from '../model/club-join-request.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { catchError } from 'rxjs';
import { environment } from 'src/env/environment';
import Swal from 'sweetalert2';
import { PersonInfoService } from '../../person.info/person.info.service';
import { PersonInfo } from '../../person.info/model/info.model';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
}) 
export class ClubComponent implements OnInit {

  user: User | null = null;
  club: Club[] = [];
  selectedClub:Club;
  shouldRenderClubForm: boolean = false;  //za staru formu koja je bila dole
  shouldEdit: boolean = false;
  currentUserId: number | null = null;

  clubJoinRequests: ClubJoinRequest[] = [];
  userRequestCache: { [key: number]: boolean } = {};
  userIsOwner: {[key: number]: boolean } = {};
  userIsMember: {[key: number]: boolean } = {};

  //samo za formu da se zatvara samo na click van
  isMouseDownWithinForm: boolean=false;
  isMouseUpWithinForm: boolean = false;
  isMouseDownWithinOverlay: boolean=false;
  isMouseUpWithinOverlay: boolean =false;
  shouldRenderForm: boolean=false;      // za novu  formu koja iskoci

  //tmp za preference sort
  //postavi tags koje hoces da budu, kad napravimo kviz i kada se budu cuvale userPreferences onda lako mozemo samo ucitati, do tad hardcoded
  userTags = [2, 3, 4]
  clubIsRecommended: {[key: number]: boolean} = {}; //kad se apply neki drugi sort kriterijum, ovo postaviti na prazno
  ownerNames: { [key: number]: string } = {}; 
  //userTags: number[] = [];
  /*clubs = [
    {
        id: 1,
        name: "Football Club A",
        description: "A popular football club with a rich history.",
        image: "images/clubs/8fe8e8ca-6839-47cb-847b-cad471a4e34d.png",
        userId: 1,
        userIds: [1, 102, 103],
        imageBase64: null,
        tags: [1, 2, 3]
    },
    {
        id: 2,
        name: "Basketball Club B",
        description: "A rising basketball club known for its young talent.",
        image: "images/clubs/8fe8e8ca-6839-47cb-847b-cad471a4e34d.png",
        userId: 1,
        userIds: [1, 202, 203],
        imageBase64: null,
        tags: [4, 5, 6]
    },
    {
        id: 3,
        name: "Tennis Club C",
        description: "A prestigious tennis club with world-class facilities.",
        image: "images/clubs/8fe8e8ca-6839-47cb-847b-cad471a4e34d.png",
        userId: 1,
        userIds: [1, 302],
        imageBase64: null,
        tags: [7, 8, 9]
    }
    ];*/




  constructor(private service: AdministrationService, private authService: AuthService, private personInfoService: PersonInfoService) {}

  ngOnInit(): void {
    this.getAllClubs();
    this.authService.user$.subscribe((user: User | null) => {
      this.currentUserId = user ? user.id : null; 
      this.user = user;
      console.log(user);

     // console.log('sort klubova:');

    });
  }

  sortByPreference(): void{
    if(this.userTags.length === 0){
      Swal.fire({
        title: 'We still haven\'t figured out your preferences. Do you want to do a quick quiz so we can learn more about you?',
        icon: 'info',
        showCancelButton: true,
        showCloseButton: true, 
        confirmButtonText: 'Do the quiz',
        cancelButtonText: 'Maybe later',
        allowOutsideClick: false ,
      }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Ako je korisnik kliknuo na "Remove tour"
        }
      });
    }
    else{
      const sortedClubs = this.club.sort((a, b) => {
        const matchesA = a.tags.filter(tag => this.userTags.includes(tag)).length;
        const matchesB = b.tags.filter(tag => this.userTags.includes(tag)).length;
        return matchesB - matchesA; // Više poklapanja prvo
      });
      this.club=sortedClubs;

      //postavljanje recommended klubova
      this.clubIsRecommended = {}; 
      sortedClubs.slice(0, 3).forEach(club => {
        if(club.id !== undefined){
          this.clubIsRecommended[club.id] = true;
        }
      });
    }
  }

  getAllClubs(): void {
    this.service.getAllClubs().subscribe({
      next: (result: PagedResults<Club>) => {
        this.club = result.results; 
        this.onInitCacheFill();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    this.getClubJoinRequests();
  }

  getClubJoinRequests(){
    this.service.getClubJoinRequests().subscribe({
      next: (result: PagedResults<ClubJoinRequest>) => {
        this.clubJoinRequests = result.results;
        this.populateUserRequestCache();
        //console.log(result.results);
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
      //console.log(club);
      if(club.id !== undefined){
        this.userRequestCache[club.id] = false;
        if(club.userId !== undefined){
          this.loadOwnerNames(club.userId);
        }

      }
      if(club.id !== undefined && club.userId === this.user?.id){
        this.userIsOwner[club.id] = true;
      }
    }
   // console.log('owner ovih klubova', this.userIsOwner);
   // console.log('requestovi: ', this.userRequestCache);
  }

  addClubJoinRequest(club: any, event:MouseEvent){
    event.preventDefault();  // Sprečava akciju linka
    event.stopPropagation(); // Sprečava širenje događaja na roditelja

    //console.log(club);

    const clubJoinRequest: ClubJoinRequest = {
      id : 0,
      userId : 0, //To-do : currentUser.id
      clubId : club.id,
      status : 0
    }
    if(this.user !== null){
      //console.log(this.user.id);
      clubJoinRequest.userId = this.user.id;
    }
   // console.log(this.userRequestCache);

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

  cancelClubJoinRequest(club: any, event:MouseEvent){
    event.preventDefault();  // Sprečava akciju linka
    event.stopPropagation(); // Sprečava širenje događaja na roditelja
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

  onAddClicked(): void {
    this.shouldRenderClubForm = true; 
    this.shouldRenderForm=true;
    this.shouldEdit = false; 
  }

  onEditClicked(club: Club, event:MouseEvent): void {

    event.preventDefault();  // Sprečava akciju linka
    event.stopPropagation(); // Sprečava širenje događaja na roditelja
    

    this.shouldRenderForm=true; //za formu koja izadje kao popup
    this.selectedClub=club;
    this.shouldRenderClubForm = true; 
    this.shouldEdit=true;
  }
  onFormClosed(): void {
    this.shouldRenderClubForm = false; 
    this.shouldRenderForm = false;
    this.shouldEdit = false; 
}


  getImage(image: string): string {
    return environment.webroot + image;
  }

  closeForm(){
    //console.log("overlay click");
    if(!this.isMouseDownWithinForm){
      this.shouldRenderClubForm=false;
      this.shouldRenderForm=false;
    }
  }

  mouseDownForm(event: MouseEvent){
    event.stopPropagation();
    this.isMouseDownWithinForm = true;
    //console.log('mousedownform');
    this.isMouseDownWithinOverlay = false;
  }
  mouseUpForm(){

  }
  mouseDownOverlay(){
    this.isMouseDownWithinForm=false;
  }
  mouseUpOverlay(){

    //console.log(this.isMouseDownWithinForm);
  }
  loadOwnerNames(userId: number): void {
    if (!this.ownerNames[userId]) {
      if(this.user?.role==='tourist'){
        this.personInfoService.getTouristInfo(userId).subscribe({
          next: (result: PersonInfo) => {
            this.ownerNames[userId] = `${result.name} ${result.surname}`;
          },
          error: () => {
            this.ownerNames[userId] = "greska";
          }
        });
      }
      else{
        this.personInfoService.getAuthorInfo(userId).subscribe({
          next: (result: PersonInfo) => {
            this.ownerNames[userId] = `${result.name} ${result.surname}`;
          },
          error: () => {
            this.ownerNames[userId] = "greska";
          }
        });
      }
    }
  }
}
