import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { io } from 'socket.io-client';
import {CommonModule, NgFor, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-plana-principal',
  templateUrl: './plana-principal.component.html',
  styleUrls: ['./plana-principal.component.css'],
  imports: [
    // NgIf,
    // NgFor,
    // NgForOf,
    CommonModule
  ]
})
export class PlanaPrincipalComponent {
  socket: any;
  videoList: any[] = [];
  // opened: boolean = false;
  // verified: any = undefined;
  codi: string = "";
  showDiv = false;
  progreso: number = 100;
  tiempoRestante: number = 10000;
  user: string = "hola"

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone, private s: LoginToHomeService) {
    this.user = s.getUserLogat()
    this.socket = io("http://192.168.56.2:8888", { transports: ['websocket'], key: 'angular-client' });

    this.socket.on("hello", (arg: any) => {
      console.log(arg);
    });

    this.socket.on("VideoList", (videoObj: any[]) => {
      videoObj.forEach(element => {
        this.videoList.push(element);
      })
    });

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

        document.getElementById('verifyDiv')!.style.display = 'none';
      }

      if(video.verified) {
        progress(5, 5, document.getElementById("progressBar"));
      }
      else {
        setTimeout(() => {
          document.getElementById('verifyErrorDiv')!.style.display = 'none';
          this.resetearProgreso();
        }, 5000);
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
}

