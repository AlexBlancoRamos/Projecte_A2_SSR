import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {LoginToHomeService} from "../login-to-home.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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


    this.http.post<any>('http://192.168.56.2:3000/api/auth', datos).subscribe(
      response => {
        if (response) {
          console.log(response)
          this.s.addUserLogat(response.user.email)
          alert("Inicio de sesión exitoso");
          localStorage.setItem('jwt', response.token);
          this.router.navigate(['/inici']);
        }
      },
      error => {
        alert("Usuario y/o contraseña incorrectos");
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
