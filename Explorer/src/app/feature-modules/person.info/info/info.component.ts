import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PersonInfoService } from '../person.info.service';
import { PersonInfo } from '../model/info.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourPreferenceService } from '../../tour-authoring/tour-preference.service';
import { environment } from 'src/env/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProfileBadgesModalComponent } from '../profile-badges-modal/profile-badges-modal.component';
import { AchievementLevel, BadgeDto, BadgeName } from '../../badges/model/badge.model';
import { BadgeService } from '../../badges/popups/badge.service';

@Component({
  selector: 'xp-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  infoPerson: PersonInfo;
  editPerson: PersonInfo;
  user: User | null = null;
  imageBase64: string | null = null;
  editMode: boolean = false;
  showAd: boolean = true;
  
  isChatOpen: boolean = false;
  chatMessage: string = 'Welcome to your profile! Here you can view and edit your personal information. Click "Edit Profile" to make changes to your name, surname, biography, or motto. You can also update your profile picture by selecting a new image. If you need any help, feel free to ask!';

  earnedBadges: string[];
  populate: boolean = true;

  constructor(
    private profileService: PersonInfoService,
    private authService: AuthService,
    private badgeService: BadgeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private preferenceService: TourPreferenceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.editPerson = { id: 0, userId: 0, name: '', surname: '', imageUrl: '', biography: '', motto: '', imageBase64: '', equipment: [], wallet: 0 };
    this.authService.user$.subscribe(user => {
      if (user && user.id) {
        this.user = user;
        this.getPersonInfo(user.id);
      }
    });
    this.preferenceService.hasTourPreference().subscribe({
      next: (result) => {
        this.showAd = !result;
      },
      error: (err) => {
        console.error('Error fetching preferences', err);
        this.showAd = true;
      }
    });
  }

  toggleChat(isChat: boolean): void {
    this.isChatOpen = isChat;
  }

  showAchievements(): void {
    this.populateBadges();
    if (!this.populate) {
      this.badgeService.getAll().subscribe(response => {
        const badges = response.items;
        this.earnedBadges = this.mapBadgesToFileNames(badges);
      });
    }
    this.dialog.open(ProfileBadgesModalComponent, {
      data: this.earnedBadges,
      width: '900px',
    });
  }

  populateBadges(): void {
    this.earnedBadges = [
      '100km.png', 'photo.png', 'SOCIAL.png', 'taster.png',
      'culture_bronze.png', 'adventure_bronze.png', 'adventure_silver.png',
      'mountain_bronze.png', 'mountain_silver.png',
      'party_bronze.png', 'city_bronze.png', 'relax_bronze.png',
      'wildlife_bronze.png', 'wildlife_silver.png',
      'beach_bronze.png', 'beach_silver.png', 'beach_gold.png'
    ];
  }

  mapBadgesToFileNames(badges: BadgeDto[]): string[] {
    const specialBadgeMap: { [key in BadgeName]?: string } = {
      [BadgeName.ExplorerStep]: '100km.png',
      [BadgeName.Globetrotter]: '1000km.png',
      [BadgeName.TravelBuddy]: 'buddies.png',
      [BadgeName.PhotoPro]: 'photo.png',
      [BadgeName.SocialButterfly]: 'SOCIAL.png',
      [BadgeName.TourTaster]: 'taster.png'
    };

    const shortenedNameMap: { [key in BadgeName]?: string } = {
      [BadgeName.PartyManiac]: 'party',
      [BadgeName.MountainConqueror]: 'mountain',
      [BadgeName.CulturalEnthusiast]: 'cultural',
      [BadgeName.AdventureSeeker]: 'adventure',
      [BadgeName.NatureLover]: 'nature',
      [BadgeName.CityExplorer]: 'city',
      [BadgeName.HistoricalBuff]: 'history',
      [BadgeName.RelaxationGuru]: 'relax',
      [BadgeName.WildlifeWanderer]: 'wildlife',
      [BadgeName.BeachLover]: 'beach'
    };

    return badges
      .filter(b => b.level !== AchievementLevel.None || specialBadgeMap[b.name])
      .map(b => {
        if (specialBadgeMap[b.name]) {
          return specialBadgeMap[b.name]!;
        }
        const base = shortenedNameMap[b.name] ?? BadgeName[b.name].toLowerCase();
        const level = AchievementLevel[b.level].toLowerCase();
        return `${base}_${level}.png`;
      });
  }

  getPersonInfo(personId: number): void {
    const errorHandler = () => {
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Profile',
        text: 'There was an error while loading your profile information. Please try again later.',
        confirmButtonText: 'OK'
      });
    };

    if (this.user?.role === 'tourist') {
      this.profileService.getTouristInfo(personId).subscribe({
        next: (result: PersonInfo) => {
          this.infoPerson = result;
          this.editPerson = { ...result };
          this.imageBase64 = null;
        },
        error: (err) => {
          console.error('Error fetching person info:', err);
          errorHandler();
        }
      });
    } else if (this.user?.role === 'author') {
      this.profileService.getAuthorInfo(personId).subscribe({
        next: (result: PersonInfo) => {
          this.infoPerson = result;
          this.editPerson = { ...result };
          this.imageBase64 = null;
        },
        error: (err) => {
          console.error('Error fetching person info:', err);
          errorHandler();
        }
      });
    } else {
      errorHandler();
    }
  }

  getAdImage(image: string) {
    return environment.webroot + "images/quiz/" + image;
  }

  setDefaultProfile(): void {
    const defaultImage = 'assets/images/logo.png';
    this.infoPerson = {
      id: 0, userId: this.user?.id ?? 0, name: 'Unknown', surname: 'User',
      imageUrl: defaultImage, biography: 'This is a default biography.',
      motto: 'Stay curious!', imageBase64: '', equipment: [], wallet: 0
    };
    this.editPerson = { ...this.infoPerson };
    this.imageBase64 = null;
    this.cdr.detectChanges();
  }

  updateProfile(): void {
    if (!this.editPerson.imageBase64) {
      this.editPerson.imageBase64 = this.infoPerson.imageBase64;
    }

    const successHandler = (response: any) => {
      console.log('Profile updated successfully', response);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully!',
        confirmButtonColor: '#5a67d8'
      });
      this.infoPerson = { ...this.editPerson };
      this.infoPerson.imageUrl = this.imageBase64 || this.infoPerson.imageUrl;
      this.cdr.detectChanges();
      this.editMode = false;
    };

    const errorHandler = (err: any) => {
      console.error('Error updating profile:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating your profile. Please try again later.',
        confirmButtonColor: '#d33'
      });
    };

    if (this.user?.role === 'tourist') {
      this.profileService.updateTouristInfo(this.editPerson).subscribe({
        next: successHandler,
        error: errorHandler
      });
    } else if (this.user?.role === 'author') {
      this.profileService.updateAuthorInfo(this.editPerson).subscribe({
        next: successHandler,
        error: errorHandler
      });
    }
  }

  getImage(profilePicture: string): string {
    if (profilePicture && profilePicture.startsWith('data:image')) {
      return profilePicture;
    }
    return environment.webroot + profilePicture;
  }

  closeAd() {
    this.showAd = false;
  }

  navigateToQuiz() {
    this.router.navigate(['/quiz-intro']);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
        this.editPerson.imageBase64 = this.imageBase64;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  enableEditMode(): void {
    this.editPerson = { ...this.infoPerson };
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.imageBase64 = null;
  }
}