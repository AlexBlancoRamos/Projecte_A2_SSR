import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginToHomeService {

  userLogat: string = ""

  constructor() { }

  addUserLogat(user: string){
    this.userLogat = user
  }

  getUserLogat(){
    return this.userLogat
  }
}
