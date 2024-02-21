import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlanaPrincipalComponent } from './plana-principal/plana-principal.component';
import {RouterOutlet} from "@angular/router";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {routing} from "./app.routes";
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import {NgFor, NgIf} from "@angular/common";
import {TokenInterceptor} from "./token.interceptor";


@NgModule({
  declarations: [
    AppComponent,
    PlanaPrincipalComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    HttpClientModule,
    routing,
    FormsModule,
    NgIf,
    NgFor
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export class appConfig {
}
