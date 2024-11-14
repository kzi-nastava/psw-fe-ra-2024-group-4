import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  login(): void {
    const login: Login = {
      username: this.loginForm.value.username || "",
      password: this.loginForm.value.password || "",
    };
    const message = 'Pleas fill in all fields correctly.';
    if (this.loginForm.valid) {
      this.authService.login(login).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
      });
    }
    else{
      this.snackBar.open(message,'Close', {
       duration: 3000,
       verticalPosition: 'bottom',
       horizontalPosition: 'center',
       panelClass: ['error-snackbar']
      })
    }
  }
}
