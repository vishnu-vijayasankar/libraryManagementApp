import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import bookJson from '../assets/books.json';
import empJson from '../assets/employee.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  bookDetails = [];
  empDetails = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('allBookDetails').then(param => {
        if (param == null) {
          this.bookDetails = bookJson.books;
          this.storage.set('allBookDetails', this.bookDetails);
          this.empDetails = empJson.employee;
          this.storage.set('allEmpDetails', this.empDetails);
        }
      });
    });
  }
}
