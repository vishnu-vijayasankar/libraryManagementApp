import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared.service';
import { IonicStorageModule } from '@ionic/storage';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [CommonModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule,
    FormsModule, IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    SharedService,
    QRScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
