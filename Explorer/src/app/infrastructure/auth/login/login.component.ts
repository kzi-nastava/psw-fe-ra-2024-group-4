import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AsyncValidatorFn,AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, map, catchError, of ,Observable} from 'rxjs';

@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.usernameValidator()],
      updateOn: 'blur' 
    }),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  login(): void {
    const login: Login = {
      username: this.loginForm.value.username || "",
      password: this.loginForm.value.password || "",
    };
    const message = 'Please fill in all fields correctly.';
    if (this.loginForm.valid) {
      this.authService.login(login).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.loginForm.setErrors({ invalidCredentials: true });
        },
      });
    } else {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar']
      });
    }
  }

  private usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ usernameNotFound: boolean } | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.authService.checkUsername(control.value).pipe(
        debounceTime(300), // Sprečavanje prečestih zahteva
        map((exists) => (exists ? null : { usernameNotFound: true })),
        catchError(() => of(null)) // Ignorisanje grešaka
      );
    };
  }
  
}
