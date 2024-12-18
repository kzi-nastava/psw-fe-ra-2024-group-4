import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PersonInfoService } from '../person.info.service';
import { PersonInfo } from '../model/info.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourPreferenceService } from '../../tour-authoring/tour-preference.service';
import { environment } from 'src/env/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


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
  showAd:boolean=true;
  

  constructor(
    private profileService: PersonInfoService,
    private authService: AuthService ,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private preferenceService:TourPreferenceService
  ) { }

  ngOnInit(): void {
    this.editPerson = { id: 0, userId: 0, name: '', surname: '', imageUrl: '', biography: '', motto: '', imageBase64: '', equipment: [], wallet: 0 };
    this.authService.user$.subscribe(user => {
      if (user && user.id) {
        this.user = user;
        console.log(user.id);
        this.getPersonInfo(user.id);  
      }
      
    });
    this.preferenceService.hasTourPreference().subscribe({
      next: (result) => {
        this.showAd = !result;
        console.log('Preference status:', result);
      },
      error: (err) => {
        console.error('Error fetching preferences', err);
        this.showAd = true; 
      }
    });
  }

  getPersonInfo(personId: number): void {
    if(this.user?.role === 'tourist'){
      this.profileService.getTouristInfo(personId).subscribe({
        next: (result: PersonInfo) => {
          this.infoPerson = result;
          this.editPerson = { ...result };
          this.imageBase64 = null;
        },
        error: (err) => {
          console.error('Error fetching person info:', err);  
          alert("There was an error while loading your profile information. Please try again later.");

        }
      });
    } else if(this.user?.role === 'author') {
      this.profileService.getAuthorInfo(personId).subscribe({
        next: (result: PersonInfo) => {
          this.infoPerson = result;
          this.editPerson = { ...result };
          this.imageBase64 = null;
        },
        error: (err) => {
          console.error('Error fetching person info:', err);  
          alert("There was an error while loading your profile information. Please try again later.");

        }
      });
    } else {
      alert("There was an error while loading your profile information. Please try again later.");

    }
    
  }
  getAdImage(image:string){
    return environment.webroot + "images/quiz/" + image;
  }

  updateProfile(): void {
    if (this.user?.role === 'tourist') {
      if (!this.editPerson.imageBase64) {
        this.editPerson.imageBase64 = this.infoPerson.imageBase64; 
      }
      console.log('Updating with:', this.editPerson);
      this.profileService.updateTouristInfo(this.editPerson).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully!',
            confirmButtonColor: '#5a67d8'
          });
          // Ažuriraj infoPerson odmah sa ažuriranim podacima
          this.infoPerson = { ...this.editPerson };
          this.infoPerson.imageUrl = this.imageBase64 || this.infoPerson.imageUrl; // Prioritetno koristi novu sliku
    
          // Osveži prikaz
          this.cdr.detectChanges();
          this.editMode = false;
        },
        error: (err) => {
          console.error('Error updating profile:', err);
           Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'An error occurred while updating your profile. Please try again later.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else if (this.user?.role === 'author') {
      if (!this.editPerson.imageBase64) {
        this.editPerson.imageBase64 = this.infoPerson.imageBase64; 
      }
      this.profileService.updateAuthorInfo(this.editPerson).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully!',
            confirmButtonColor: '#5a67d8'
          });
  
          
          // Ažuriraj infoPerson odmah sa ažuriranim podacima
          this.infoPerson = { ...this.editPerson };
          this.infoPerson.imageUrl = this.imageBase64 || this.infoPerson.imageUrl; // Prioritetno koristi novu sliku
    
          // Osveži prikaz
          this.cdr.detectChanges();
          this.editMode = false;
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'An error occurred while updating your profile. Please try again later.',
            confirmButtonColor: '#d33'
          });
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'An error occurred while updating your profile. Please try again later.',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }
  
  
  getImage(profilePicture: string): string {
    if (profilePicture.startsWith('data:image')) {
      return profilePicture; // Vrati `base64` podatke direktno ako su već u tom formatu
    }
    return environment.webroot + profilePicture; // Inače koristi `webroot`
  }
  closeAd() {
    this.showAd = false;
}

navigateToQuiz() {
    this.router.navigate(['/quiz-intro']);
}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      this.editPerson.imageBase64 = this.imageBase64; // Ažuriranje `editPerson` objekta
      this.cdr.detectChanges(); // Forsiranje promene da bi UI prikazao novu sliku
    };
    reader.readAsDataURL(file);
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
