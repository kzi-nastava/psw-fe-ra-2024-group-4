import { Component, OnInit } from '@angular/core';
import { PersonInfoService } from '../person.info.service';
import { PersonInfo } from '../model/info.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  infoPerson: PersonInfo;  

  constructor(
    private profileService: PersonInfoService,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user && user.id) {
        this.getPersonInfo(user.id);  
      }
    });
  }

  getPersonInfo(personId: number): void {
    this.profileService.getPersonInfo(personId).subscribe({
      next: (result: PersonInfo) => {
        this.infoPerson = result;
      },
      error: (err) => {
        console.error('Error fetching person info:', err);  
      }
    });
  }

  updateProfile(): void {
    this.profileService.updatePersonInfo(this.infoPerson).subscribe({
      next: (response) => {
        console.log('Profile updated successfully', response);     
      },
      error: (err) => {
        console.error('Error updating profile:', err);     
      }
    });
  }
}
