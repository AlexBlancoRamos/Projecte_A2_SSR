import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { LoginToHomeService } from "../login-to-home.service";
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-plana-principal',
  templateUrl: './plana-principal.component.html',
  styleUrls: ['./plana-principal.component.css'],
})

export class PlanaPrincipalComponent implements OnInit {
  socket: any;
  videoList: any[] = [];
  codi: string = "";
  showDiv = false;
  user: string = "hola";

  constructor(private router: Router, private cdRef: ChangeDetectorRef, private ngZone: NgZone, private s: LoginToHomeService, private http: HttpClient) {
    this.user = s.getUserLogat();
  }

  ngOnInit() {
    this.initializeSocket();
    this.fetchVideoList();
  }

  initializeSocket() {
    this.socket = io("http://192.168.56.2:8888", { transports: ['websocket'], key: 'angular-client' });

    this.socket.on("hello", (arg: any) => {
      console.log(arg);
    });

    this.socket.on("VideoList", (videoObj: any[]) => {
      this.videoList = videoObj;
    });

    this.socket.on("CodiVideo", (args: any) => this.codi = args);
  }

  fetchVideoList() {
    this.http.get<any>('http://192.168.56.2:3000/api/videos').subscribe(
      response => {
        this.videoList = response.videos;
      }
    );
  }

  openVideoList() {
    this.showDiv = !this.showDiv;
  }

  async toggleAndRequestVideo(video: any) {
    video.opened = !video.opened;

    this.socket.emit("RequestVideoVerification", "Video requested");

    this.socket.on("VerifiedCorrectly", (arg: boolean) => {
      video.verified = arg;

      function progress(timeleft: number, timetotal: number, $element: any) {
        let progressBarWidth = timeleft * $element.width() / timetotal;
        $element.find('div').animate({ width: progressBarWidth }, 500).html(Math.floor(timeleft/60) + ":"+ timeleft%60);
        if(timeleft > 0) {
          setTimeout(function() {
            progress(timeleft - 1, timetotal, $element);
          }, 1000);
        }
      }

      if(video.verified) {
        progress(5, 5, document.getElementById("progressBar"));
        document.getElementById('verifyDiv')!.style.display = 'none';
      }
      else {
        progress(5, 5, document.getElementById("progressBar"));
        document.getElementById('verifyErrorDiv')!.style.display = 'none';
      }
    });
  }

  cerrarMenasaje(nombre_div: string) {
    document.getElementById(nombre_div)!.style.display = 'none';
  }

  /*  resetearProgreso() {
      this.progreso = 100;
      this.tiempoRestante = 10000;
    }*/

  mostrarPopup() {
    document.getElementById('popup')!.style.display = 'block';
    document.getElementById('overlay')!.style.display = 'block';
  }

  ocultarPopup() {
    document.getElementById('popup')!.style.display = 'none';
    document.getElementById('overlay')!.style.display = 'none';
  }

  logout(){
    localStorage.removeItem("jwt")
    this.router.navigate(['/login']);
  }
}

