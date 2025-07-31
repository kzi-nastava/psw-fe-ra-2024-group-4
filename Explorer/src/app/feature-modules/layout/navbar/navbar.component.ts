import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CustomPopupComponent } from '../../badges/popups/custom-popup/custom-popup.component';
import { AchievementLevel, BadgeDto, BadgeName } from '../../badges/model/badge.model';
import { BadgeService } from '../../badges/popups/badge.service';


@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  showNotifications = false; 
  userLevel: number = 1;
  isUserLevelLoaded: boolean = false;
  @ViewChild(CustomPopupComponent) customPopupComponent!: CustomPopupComponent;


  constructor(
    private authService: AuthService,
    private badgeService: BadgeService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
      this.getUserLevel();  // sada je this.user sigurno definisan
    }
    });
    //this.getUserLevel();
    // this.checkNewBadges();
  }

  onLogout(): void {
    this.authService.logout();
  }
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications; 
  }

  isToursMenuOpen = false;
  isBlogsMenuOpen = false;
  isClubsMenuOpen = false;
  isHelpMenuOpen = false;

  openToursMenu() {
      this.isToursMenuOpen = true;
      this.isBlogsMenuOpen = false; // Close blogs menu
      this.isClubsMenuOpen = false; // Close clubs menu
      this.isHelpMenuOpen = false;
  }
  
  openBlogsMenu() {
      this.isBlogsMenuOpen = true;
      this.isToursMenuOpen = false; // Close tours menu
      this.isClubsMenuOpen = false; // Close clubs menu
      this.isHelpMenuOpen = false;
  }
  
  openClubsMenu() {
      this.isClubsMenuOpen = true;
      this.isToursMenuOpen = false; // Close tours menu
      this.isBlogsMenuOpen = false; // Close blogs menu
      this.isHelpMenuOpen = false;
  }

  openHelpMenu() {
    this.isClubsMenuOpen = false;
    this.isToursMenuOpen = false; // Close tours menu
    this.isBlogsMenuOpen = false; // Close blogs menu
    this.isHelpMenuOpen = true;
}
  
  closeAllMenus() {
      this.isToursMenuOpen = false;
      this.isBlogsMenuOpen = false;
      this.isClubsMenuOpen = false;
      this.isHelpMenuOpen = false;
  }
  getUserLevel(): void{
    if(!this.user) return;
    this.authService.getPersonInfo(this.user.id).subscribe({
      next: (person) => {
        this.isUserLevelLoaded = true;
        this.userLevel = person.level || 1;
        console.log("Posle get: ", this.userLevel)
      },
      error: (err) => {
        console.error('Error fetchin user level!');
      }
    })
  }
  canCreateEncounter(): boolean {
    console.log('Ulogovani: ',this.user)
    console.log('Level: ',this.userLevel)
    return this.user?.role === 'tourist' && this.userLevel > 9;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'x') {
      event.preventDefault(); // Prevent the default 'cut' action
      this.customPopupComponent.showGlobetrotterPopup();
    }
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault();
      this.customPopupComponent.showCityBronze();
    }
    if (event.ctrlKey && event.key === 'd') {
      event.preventDefault();
      this.customPopupComponent.showCultureGold();
    }
  }

  checkNewBadges(){
    this.badgeService.getAllNotRead().subscribe(res => {
      res.items.forEach(badge => {
        this.showBadgePopup(badge);
        this.badgeService.readBadge(badge.id).subscribe(); // markiraj kao pročitan
      });
    });
  }

    showBadgePopup(badge: BadgeDto) {
    const name = BadgeName[badge.name];      // iz enum-a u string, npr. 'PartyManiac'
    const level = AchievementLevel[badge.level];  // 'Gold', 'Bronze' itd.

    const key = name + level;  // npr. 'PartyManiacGold'

    const popupMap: { [key: string]: () => void } = {
    PartyManiacBronze: () => this.customPopupComponent.showPartyBronze(),
    PartyManiacSilver: () => this.customPopupComponent.showPartySilver(),
    PartyManiacGold: () => this.customPopupComponent.showPartyGold(),

    MountainConquerorBronze: () => this.customPopupComponent.showMountainBronze(),
    MountainConquerorSilver: () => this.customPopupComponent.showMountainSilver(),
    MountainConquerorGold: () => this.customPopupComponent.showMountainGold(),

    BeachLoverBronze: () => this.customPopupComponent.showBeachBronze(),
    BeachLoverSilver: () => this.customPopupComponent.showBeachSilver(),
    BeachLoverGold: () => this.customPopupComponent.showBeachGold(),

    WildlifeWandererBronze: () => this.customPopupComponent.showWildlifeBronze(),
    WildlifeWandererSilver: () => this.customPopupComponent.showWildlifeSilver(),
    WildlifeWandererGold: () => this.customPopupComponent.showWildlifeGold(),

    RelaxationGuruBronze: () => this.customPopupComponent.showRelaxationBronze(),
    RelaxationGuruSilver: () => this.customPopupComponent.showRelaxationSilver(),
    RelaxationGuruGold: () => this.customPopupComponent.showRelaxationGold(),

    HistoricalBuffBronze: () => this.customPopupComponent.showHistoricalBronze(),
    HistoricalBuffSilver: () => this.customPopupComponent.showHistoricalSilver(),
    HistoricalBuffGold: () => this.customPopupComponent.showHistoricalGold(),

    CityExplorerBronze: () => this.customPopupComponent.showCityBronze(),
    CityExplorerSilver: () => this.customPopupComponent.showCitySilver(),
    CityExplorerGold: () => this.customPopupComponent.showCityGold(),

    NatureLoverBronze: () => this.customPopupComponent.showNatureBronze(),
    NatureLoverSilver: () => this.customPopupComponent.showNatureSilver(),
    NatureLoverGold: () => this.customPopupComponent.showNatureGold(),

    AdventureSeekerBronze: () => this.customPopupComponent.showAdventureBronze(),
    AdventureSeekerSilver: () => this.customPopupComponent.showAdventureSilver(),
    AdventureSeekerGold: () => this.customPopupComponent.showAdventureGold(),

    CulturalEnthusiastBronze: () => this.customPopupComponent.showCultureBronze(),
    CulturalEnthusiastSilver: () => this.customPopupComponent.showCultureSilver(),
    CulturalEnthusiastGold: () => this.customPopupComponent.showCultureGold(),

    TravelBuddyNone: () => this.customPopupComponent.showTravelBuddiesPopup(),
    ExplorerStepNone: () => this.customPopupComponent.showExplorersStepPopup(),
    GlobetrotterNone: () => this.customPopupComponent.showGlobetrotterPopup(),
    PhotoProNone: () => this.customPopupComponent.showPhotoProPopup(),
    TourTasterNone: () => this.customPopupComponent.showTourTasterPopup(),
    SocialButterflyNone: () => this.customPopupComponent.showSocialPopup()
  };


    const popupFunction = popupMap[key];

    if (popupFunction) {
      popupFunction();
    } else {
      console.warn('Popup not defined for badge:', badge);
    }
  }

  



  
  scrollDown(event: Event) {
    event.preventDefault(); 

 
    if (this.router.url === '/' || this.router.url === '/home') {
      window.scrollBy({
        top: window.innerHeight, 
        behavior: 'smooth' 
      });
    }
  }
}
