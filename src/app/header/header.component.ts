import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.isUserAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenicated => {
        this.isUserAuthenticated = isAuthenicated;
      });
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.removeToken();
  }

}
