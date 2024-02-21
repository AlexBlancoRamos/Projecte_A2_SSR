import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-plana-principal',
  templateUrl: './plana-principal.component.html',
  styleUrls: ['./plana-principal.component.css']
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
  user: string = ""

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone, private s: LoginToHomeService) {
    this.user = s.getUserLogat()
    this.socket = io("http://169.254.180.117:8888", { transports: ['websocket'], key: 'angular-client' });

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

      if(video.verified) {
        setTimeout(() => {
          document.getElementById('verifyDiv')!.style.display = 'none';
          this.resetearProgreso();
        }, 5000);
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

