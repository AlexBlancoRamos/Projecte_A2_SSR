import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router, private http: HttpClient, private s: LoginToHomeService) {
  }

  usuari: string='';
  passLog: string='';

  login(): void {
    const datos = {
      email: this.usuari,
      password: this.passLog
    };

    console.log({datos})


    this.http.post<any>('http://169.254.180.117:3000/api/auth', datos).subscribe(
      response => {
        if (response) {
          console.log(response)
          this.s.addUserLogat(response.user.email)
          alert("Inicio de sesión exitoso");
          localStorage.setItem('jwt', response.token);
          // this.router.navigate(['/inici']);
        } else {
          alert("Usuario y/o contraseña incorrectos");
        }
      },
      error => {
        console.error('Error al iniciar sesión:', error);
      }
    );

    this.http.get<any>('http://169.254.180.117:3000/api/videos').subscribe();
  }
}
