import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRquest';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  signupUser(dados: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(
      `${this.API_URL}/user`, dados
    );
  }

  authUser(dados: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth`, dados
    );
  }

  isLoggedIn(): boolean {
    // o cookie USER_INFO foi definido no home.component.ts
    const JWT_TOKEN = this.cookieService.get('USER_INFO');
    return JWT_TOKEN ? true : false;
  }
}
