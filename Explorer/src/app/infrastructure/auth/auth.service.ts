import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorage } from './jwt/token.service';
import { environment } from 'src/env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from './model/login.model';
import { AuthenticationResponse } from './model/authentication-response.model';
import { User } from './model/user.model';
import { Registration } from './model/registration.model';
import { PersonInfo } from 'src/app/feature-modules/person.info/model/info.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>({username: "", id: 0, role: "" });
  @Output() userLoggedIn = new EventEmitter<void>();
  @Output() userLoggedOut = new EventEmitter<void>();

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(environment.apiHost + 'users/login', login)
      .pipe(
        tap((authenticationResponse) => {
          this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
          this.setUser();
          this.userLoggedIn.emit();
        })
      );
  }

  register(registration: Registration): Observable<AuthenticationResponse> {
    return this.http
    .post<AuthenticationResponse>(environment.apiHost + 'users', registration)
    .pipe(
      tap((authenticationResponse) => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.setUser();
      })
    );
  }

  logout(): void {
    this.router.navigate(['/home']).then(_ => {
      this.tokenStorage.clear();
      this.user$.next({username: "", id: 0, role: "" });
      this.userLoggedOut.emit();
      }
    );
  }

  checkIfUserExists(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken == null) {
      return;
    }
    this.setUser();
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).id,
      username: jwtHelperService.decodeToken(accessToken).username,
      role: jwtHelperService.decodeToken(accessToken)[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ],
    };
    this.user$.next(user);
  }

  

  isLoggedIn(): boolean{
    const user = this.user$.value;
    return user && user.id > 0;
  }

  public getUser(): BehaviorSubject<User>{
    return this.user$;
  }
  getPersonInfo(userID: number): Observable<any>{
    return this.http.get<any>(`${environment.apiHost}author/person/${userID}`);
  }

}
