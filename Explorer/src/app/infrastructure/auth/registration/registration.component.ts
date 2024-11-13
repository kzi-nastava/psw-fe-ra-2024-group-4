import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, FormsModule,FormGroupDirective,ReactiveFormsModule } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


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
    private router: Router
  ) {}

  validation_messages = {
    'username': [
      {type: 'required', message: 'Username is required'}
    ],
    'email': [
      {type: 'required', message: "Email is required"},
      {type: 'email', message: 'Enter valid email(example@domain.com)'}
    ],
    'name': [
      {type: 'required', message: 'Name is required'}
    ],
    'required': [
      {type: 'required', message: 'This field is required'}
    ],
    'password': [
      {type: 'required', message: 'Password is required'},
      {type: 'minlength', message: 'Password must be at least 8 characters long'}
    ]
  }

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    profilePicture: new FormControl('', [Validators.required]),
    biography: new FormControl('', [Validators.required]),
    motto: new FormControl('', [Validators.required])
  });

  register(): void {
    const registration: Registration = {
      name: this.registrationForm.value.name || "",
      surname: this.registrationForm.value.surname || "",
      email: this.registrationForm.value.email || "",
      username: this.registrationForm.value.username || "",
      password: this.registrationForm.value.password || "",
      profilePicture: this.registrationForm.value.profilePicture || "",
      biography: this.registrationForm.value.biography || "",
      motto: this.registrationForm.value.motto || ""
    };

    if (this.registrationForm.valid) {
      this.authService.register(registration).subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
      });
    }
  }
}
