import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BACKEND_URL = environment.apiUrl + 'user';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private expireTime: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  isUserAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  removeToken() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.expireTime);
    this.deleteAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post(BACKEND_URL + '/signup', authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expireDuration = response.expiresIn;
          this.setAuthTimer(expireDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expireDuration * 1000);
          this.storeAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    const expireIn = authData.expiresIn.getTime() - now.getTime();
    if (expireIn > 0) {
      this.isAuthenticated = true;
      this.token = authData.token;
      this.userId = authData.userId;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    } else {
      this.deleteAuthData();
    }
  }

  private setAuthTimer(expireDuration: number) {
    this.expireTime = setTimeout(() => {
      this.removeToken();
    }, expireDuration * 1000);
  }
  private storeAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private deleteAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expiresIn: new Date(expirationDate),
      userId: userId
    };
  }

}
