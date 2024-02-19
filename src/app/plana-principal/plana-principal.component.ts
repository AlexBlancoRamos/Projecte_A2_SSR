import {Component, ChangeDetectorRef, NgZone} from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-plana-principal',
  templateUrl: './plana-principal.component.html',
  styleUrl: './plana-principal.component.css'
})
export class PlanaPrincipalComponent {
  socket: any;
  videoList: any[] = [];
  opened: boolean = false;
  verified: any = undefined;
  codi: string = "";
  showDiv = false;
  progreso: number = 100;
  tiempoRestante: number = 10000;

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
    this.socket = io("http://192.168.16.200:8888", { transports: ['websocket'], key: 'angular-client' });

    this.socket.on("hello", (arg: any) => {
      console.log(arg);
    });

    this.socket.on("VideoList", (videoObj: any[]) => {
      videoObj.forEach(element => {
        this.videoList.push(element);
      })
    });

    this.socket.on("CodiVideo", (args: string) => this.codi = args);

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

      setTimeout(() => {
        document.getElementById('verifyDiv')!.style.display = 'none';
        this.resetearProgreso();
      }, 10000);

      setTimeout(() => {
        document.getElementById('verifyErrorDiv')!.style.display = 'none';
        this.resetearProgreso();
      }, 10000);

      const interval = 100;

      let updateProgress = setInterval(() => {
        this.tiempoRestante -= interval;

        if (this.tiempoRestante <= 0) {
          clearInterval(updateProgress);
          this.tiempoRestante = 10000;
          this.progreso = 100;
          this.ngZone.run(() => {
            this.resetearProgreso();
          });
        } else {
          this.progreso = (this.tiempoRestante / 10000) * 100;
          this.cdRef.detectChanges();
        }
      }, interval);
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
