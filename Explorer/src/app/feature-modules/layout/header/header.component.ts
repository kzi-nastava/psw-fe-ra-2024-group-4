import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User | undefined;
  showNotifications = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Subscribe to the user observable to get the current user
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onLogout(): void {
    // Call logout method from authService
    this.authService.logout();
  }

  toggleNotifications(): void {
    // Toggle notifications visibility
    this.showNotifications = !this.showNotifications;
  }

  // Variables for menu toggling
  isToursMenuOpen = false;
  isBlogsMenuOpen = false;
  isClubsMenuOpen = false;

  // Methods to toggle different menus
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

  scrollDown(event: Event) {
    event.preventDefault();

    // Scroll the page down if on the home page
    if (this.router.url === '/' || this.router.url === '/home') {
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  }
}
