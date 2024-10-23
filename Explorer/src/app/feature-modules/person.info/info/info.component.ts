import { Component, OnInit } from '@angular/core';
import { PersonInfoService } from '../person.info.service';
import { PersonInfo } from '../model/info.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  infoPerson: PersonInfo;  
  user: User | null = null;

  constructor(
    private profileService: PersonInfoService,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user && user.id) {
        this.user = user;
        console.log(user.id);
        this.getPersonInfo(user.id);  
        
      }
    });
  }

  getPersonInfo(personId: number): void {
    if(this.user?.role === 'tourist'){
      this.profileService.getTouristInfo(personId).subscribe({
        next: (result: PersonInfo) => {
          this.infoPerson = result;
        },
        error: (err) => {
          console.error('Error fetching person info:', err);  
        }
      });
    } else if(this.user?.role === 'author') {
      this.profileService.getAuthorInfo(personId).subscribe({
        next: (result: PersonInfo) => {
          this.infoPerson = result;
        },
        error: (err) => {
          console.error('Error fetching person info:', err);  
        }
      });
    } else {
      alert('Invalid role.')
    }
    
  }

  updateProfile(): void {
    if(this.user?.role === 'tourist') {
      this.profileService.updateTouristInfo(this.infoPerson).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);     
        },
        error: (err) => {
          console.error('Error updating profile:', err);     
        }
      });
    } else if(this.user?.role === 'author') {
      this.profileService.updateAuthorInfo(this.infoPerson).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);     
        },
        error: (err) => {
          console.error('Error updating profile:', err);     
        }
      });
    } else {
      alert('Invalid role.')
    }
    
  }
}
