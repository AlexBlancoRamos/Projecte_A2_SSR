import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { io } from 'socket.io-client';
import {LoginToHomeService} from "../login-to-home.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-plana-principal',
  templateUrl: './plana-principal.component.html',
  styleUrls: ['./plana-principal.component.css'],
})

export class PlanaPrincipalComponent {
  socket: any;
  videoList: any[] = [];
  codi: string = "";
  showDiv= false;
  user: string = "hola"

  constructor(private router: Router, private cdRef: ChangeDetectorRef, private ngZone: NgZone, private s: LoginToHomeService) {
    this.user = s.getUserLogat()
    this.socket = io("http://192.168.56.2:8888", { transports: ['websocket'], key: 'angular-client' });
    this.videoList = [];

    this.user = s.getUserLogat();
    this.socket = io("http://169.254.180.117:8888", { transports: ['websocket'], key: 'angular-client' });

    this.socket.on("hello", (arg: any) => {
      console.log(arg);
    });

    this.http.get<any>('http://169.254.180.117:3000/api/videos').subscribe(
      response => {

        response.videos.forEach((element: any) => {
          this.videoList.push(element)

          console.log("ELEMENT   |   ", element);
        })
      }
    );

    console.log("array de videos  |  ", this.videoList);

    // this.socket.on("VideoList", (videoObj: any[]) => {
    //   videoObj.forEach(element => {
    //     this.videoList.push(element);
    //   })
    // });

    this.socket.on("CodiVideo", (args: any) => this.codi = args);

    this.getVideoListServer();
    this.videoList.forEach(element => console.log(element.title));
  }

  getVideoListServer() {
    this.socket.emit("RequestVideo", "");
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

  resetearProgreso() {
    this.progreso = 100;
    this.tiempoRestante = 10000;
  }

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

