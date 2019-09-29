import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, bindNodeCallback, of } from 'rxjs';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // create Auth0 instance
 private auth = new auth0.WebAuth({
    clientID: environment.auth.clientID,
    domain: environment.auth.domain,
    responseType: 'id_token token',
    redirectUri: environment.auth.auth0RedirectUri,
    audience: environment.auth.audience,
    scope: 'openid profile email'
  });

  // Track whether or not to renew token
  private authflag = 'isLoggedIn';
  // Create stream for token
  token$: Observable<string>;
  // Create stream for user profile data
  userProfile$ = new BehaviorSubject<any>(null);
  // Authentication navigation
  onAuthSuccessUrl = '/';
  onAuthFailureUrl = '/';
  logoutUrl = environment.auth.logOutUri;
  // Create observable of Auth0 parseHash method to gather auth results
  parseHash$ = bindNodeCallback(this.auth.parseHash.bind(this.auth));
  // Create observable of Auth0 checkSession method to
  // verify authorization server session and renew tokens
  checkSession$ = bindNodeCallback(this.auth.checkSession.bind(this.auth));

  constructor(private router: Router) { }

  login() {
    this.auth.authorize();
  }

  handleLoginCallback() {
    if (window.location.hash && !this.isAuthenticated) {
      this.parseHash$().subscribe(
        authResult => {
          this._setAuth(authResult);
          window.location.hash = '';
          this.router.navigate([this.onAuthSuccessUrl]);
        },
        err => this._handleError(err)
      );
    }
  }

  private _setAuth(authResult) {
    // Observable of token
    this.token$ = of(authResult.accessToken);
    // Emit value for user data subject
    this.userProfile$.next(authResult.idTokenPayload);
    // Set flag in local storage stating this app is logged in
    localStorage.setItem(this.authflag, JSON.stringify(true));
  }

  get isAuthenticated(): boolean {
    return JSON.parse(localStorage.getItem(this.authflag));
  }


  renewAuth() {
    if (this.isAuthenticated) {
      this.checkSession$({}).subscribe(
        authResult => this._setAuth(authResult),
        err => {
          localStorage.removeItem(this.authflag);
          this.router.navigate([this.onAuthFailureUrl]);
        }
      );
    }
  }

  logout() {
    // Set authentication status flag in local storage to false
    localStorage.setItem(this.authflag, JSON.stringify(false));
    // This does a refresh and redirects back to homepage
    // Make sure you have the logout URL in your Auth0
    // Dashboard Application settings in Allowed Logout URLs
    this.auth.logout({
      returnTo: this.logoutUrl,
      clientID: environment.auth.clientID
    });
  }

  private _handleError(err) {
    if (err.error_description) {
      console.error(`Error: ${err.error_description}`);
    } else {
      console.error(`Error: ${JSON.stringify(err)}`);
    }
  }

}
