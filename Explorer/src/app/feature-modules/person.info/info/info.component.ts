import { Component, OnInit } from '@angular/core';
import { PersonInfoService } from '../person.info.service';
import { PersonInfo } from '../model/info.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  infoPerson: PersonInfo;  
  user: User | null = null;
  imageBase64: string | null = null;
  editMode: boolean = false;

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
        this.getImage(this.infoPerson.imageUrl);  
      }
      
      console.log(this.imageBase64);
      console.log(this.infoPerson.imageUrl);
    });
  }

  getPersonInfo(personId: number): void {
    if(this.user?.role === 'tourist'){
      this.profileService.getTouristInfo(personId).subscribe({
        next: (result: PersonInfo) => {
          this.infoPerson = result;
          this.imageBase64 = null;
        },
        error: (err) => {
          console.error('Error fetching person info:', err);  
        }
      });
    } else if(this.user?.role === 'author') {
      this.profileService.getAuthorInfo(personId).subscribe({
        next: (result: PersonInfo) => {
          this.infoPerson = result;
          this.imageBase64 = null;
        },
        error: (err) => {
          console.error('Error fetching person info:', err);  
        }
      });
    } else {
      
    }
    
  }

  updateProfile(): void {
    if(this.user?.role === 'tourist') {
      this.profileService.updateTouristInfo(this.infoPerson).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response); 
          alert('Profile updated successfully!');
          this.editMode = false;
        },
        error: (err) => {
          console.error('Error updating profile:', err);  
          alert('Error updating profile. Please try again.');   
        }
      });
    } else if(this.user?.role === 'author') {
      this.profileService.updateAuthorInfo(this.infoPerson).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          alert('Profile updated successfully!');     
          this.editMode = false;
        },
        error: (err) => {
          console.error('Error updating profile:', err);   
          alert('Error updating profile. Please try again.');  
        }
      });
    } else {
    }
    
  }
  getImage(profilePicture: string): string {
    return  environment.webroot + profilePicture ;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.infoPerson.imageBase64 = reader.result as string;  
    };
    reader.readAsDataURL(file); 
  }
}
