import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { routing } from './app.routes';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    routing,
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
