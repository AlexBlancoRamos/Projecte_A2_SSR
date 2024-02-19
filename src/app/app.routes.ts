import { RouterModule, Routes } from '@angular/router';


import { RouterOutlet} from "@angular/router";
import {PlanaPrincipalComponent} from "./plana-principal/plana-principal.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes =[
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'inici', component: PlanaPrincipalComponent},
  {path: 'oulet', component: RouterOutlet},

];
export const routing = RouterModule.forRoot(routes);
