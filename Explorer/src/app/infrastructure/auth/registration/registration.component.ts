import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, FormsModule,FormGroupDirective,ReactiveFormsModule } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}


  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    profilePicture: new FormControl(''), // Ovo je za URL slike
    imageBase64: new FormControl('') // Novo polje za enkodovanu sliku
    
  });
  
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.registrationForm.patchValue({
          imageBase64: base64String // Postavite base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  }
  

  register(): void {
    const registration: Registration = {
      name: this.registrationForm.value.name || "",
      surname: this.registrationForm.value.surname || "",
      email: this.registrationForm.value.email || "",
      username: this.registrationForm.value.username || "",
      password: this.registrationForm.value.password || "",
      profilePicture: this.registrationForm.value.profilePicture || "", // URL slike, nakon što se obradi na backendu
      imageBase64: this.registrationForm.value.imageBase64 || "" // Base64 string za inicijalno slanje
  
    };
  
    if (this.registrationForm.valid) {
      this.authService.register(registration).subscribe({
        next: () => {
          this.router.navigate(['home']);
        }
      });
    } else {
      this.snackBar.open('Please fill in all fields correctly.', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar']
      });
    }
  }
  
}
