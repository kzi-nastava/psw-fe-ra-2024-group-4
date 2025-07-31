import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registrationForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required]),
        profilePicture: new FormControl(''),
        imageBase64: new FormControl(''),
      },
      { validators: this.passwordMatchValidator }
    );

    // Pretplata na promene u poljima za lozinku i potvrdu lozinke
    this.registrationForm.get('password')?.valueChanges.subscribe(() => {
      this.registrationForm.updateValueAndValidity();
    });

    this.registrationForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registrationForm.updateValueAndValidity();
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.registrationForm.patchValue({
          imageBase64: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  register(): void {
    if (this.registrationForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid input!',
        text: 'Please ensure all fields are filled correctly and passwords match.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const registration: Registration = {
      name: this.registrationForm.value.name || '',
      surname: this.registrationForm.value.surname || '',
      email: this.registrationForm.value.email || '',
      username: this.registrationForm.value.username || '',
      password: this.registrationForm.value.password || '',
      profilePicture: this.registrationForm.value.profilePicture || '',
      imageBase64: this.registrationForm.value.imageBase64 || '',
    };

    this.authService.register(registration).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'You can now log in to your account.',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['home']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Registration failed!',
          text: 'Please try again later.',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  // Validator za podudaranje lozinki
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
