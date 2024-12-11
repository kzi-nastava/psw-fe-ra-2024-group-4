import { Component, Input } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ClubTour } from '../model/club-tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourOverviewService } from '../../tour-authoring/tour-overview.service';
@Component({
  selector: 'xp-club-tour',
  templateUrl: './club-tour.component.html',
  styleUrls: ['./club-tour.component.css']
})
export class ClubTourComponent {
  @Input() clubId!: number;
  @Input() ownerId!: number;
  isOwner: boolean = false;
  user: User | null = null;
  clubTours: ClubTour[] = [];

  tourTagMap: { [key: number]: string } = {
    0: 'Cycling',
    1: 'Culture',
    2: 'Adventure',
    3: 'FamilyFriendly',
    4: 'Nature',
    5: 'CityTour',
    6: 'Historical',
    7: 'Relaxation',
    8: 'Wildlife',
    9: 'NightTour',
    10: 'Beach',
    11: 'Mountains',
    12: 'Photography',
    13: 'Guided',
    14: 'SelfGuided'
  };



  constructor(private service: AdministrationService, private authService: AuthService, private tourOverviewService: TourOverviewService){}

  ngOnInit(){
    console.log(this.clubId);
    this.getUser();
    this.getClubTours();
  }


  
  getUser(): void{
    this.authService.user$.subscribe((user) => {
      this.user = user; 
      //console.log('PROVERA');
      console.log(user);
      //this.userId = user.id;
      if(user.id === this.ownerId){
        this.isOwner = true;
      }
    });
  }

  getClubTours(): void{
    this.service.getAllClubTours().subscribe({
      next: (result: PagedResults<ClubTour>) =>{
        this.clubTours = result.results.filter(clubTour => clubTour.clubId === this.clubId);
        this.getToursInfo();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  getToursInfo(): void{
    this.clubTours.forEach((clubTour) => {
      if (clubTour.tourId) {
        this.tourOverviewService.getById(clubTour.tourId).subscribe({
          next: (tour) => {
            clubTour.title = tour.tourName;
            clubTour.description = tour.tourDescription;
            clubTour.price = tour.price;
            clubTour.difficulty = tour.tourDifficulty;
            clubTour.tags = tour.tags;
            //clubTour.lengthInKm 
          },
          error: (err) => {
           // console.error(Error fetching tour details for tourId: ${clubTour.tourId}, err);
          }
        });
      } else {
        //console.warn(ClubTour with missing tourId:, clubTour);
      }
    });
  }
  getTagNumber(word: string): number { //daj broj od tada
    for (const [key, value] of Object.entries(this.tourTagMap)) {
      if (value === word) {
        return +key; // Convert the key back to a number
      }
    }
    return -1; // Return -1 or any default value if the word is not found
  }

}

