import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

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


  constructor(
    private authService: AuthService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getUserLevel();
    });
    
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


  openToursMenu() {
      this.isToursMenuOpen = true;
      this.isBlogsMenuOpen = false; // Close blogs menu
      this.isClubsMenuOpen = false; // Close clubs menu
  }
  
  openBlogsMenu() {
      this.isBlogsMenuOpen = true;
      this.isToursMenuOpen = false; // Close tours menu
      this.isClubsMenuOpen = false; // Close clubs menu
  }
  
  openClubsMenu() {
      this.isClubsMenuOpen = true;
      this.isToursMenuOpen = false; // Close tours menu
      this.isBlogsMenuOpen = false; // Close blogs menu
  }
  
  closeAllMenus() {
      this.isToursMenuOpen = false;
      this.isBlogsMenuOpen = false;
      this.isClubsMenuOpen = false;
  }
  getUserLevel(): void{
    if(!this.user) return;
    this.authService.getPersonInfo(this.user.id).subscribe({
      next: (person) => {
        this.isUserLevelLoaded = true;
        this.userLevel = person.level || 1;
      },
      error: (err) => {
        console.error('Error fetchin user level!');
      }
    })
  }
  canCreateEncounter(): boolean {
    return this.user?.role === 'tourist' && this.userLevel > 9;
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
