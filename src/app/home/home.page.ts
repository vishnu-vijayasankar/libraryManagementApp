import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../shared.service.js';
import { Storage } from '@ionic/storage';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public searchTerm = '';
  public index: number;
  public text: any;
  role = 'title';

  bookDetails = [];
  bookDetailsTemp = [];

  constructor(
    public navController: NavController,
    public shared: SharedService,
    public storage: Storage,
    private qrScanner: QRScanner
  ) {}
  ngOnInit() {
    // const defaultRole = 'title';
    // this.setFilteredItems(defaultRole);
    window.document.querySelector('ion-app').classList.add('transparentBody');
  }
  filterBooks(searchTerm, role) {
    return this.bookDetails.filter(book => {
      return book[role].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  setFilteredItems(role) {
    this.bookDetailsTemp = this.filterBooks(this.searchTerm, this.role);
  }
  roleChange(value) {
    this.role = value;
  }
  async showDetails(index) {
    this.shared.thisBookDetails.push(this.bookDetailsTemp[index]);
    await this.storage.set('thisBookDetails', this.bookDetailsTemp[index]);
    await this.navController.navigateForward('/listing');
  }
  async scanBook() {
    // Optionally request the permission early
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          const ionApp = document.getElementsByTagName(
            'ion-app'
          )[0] as HTMLElement;

          // start scanning
          this.qrScanner.show();
          ionApp.style.display = 'none';
          const scanSub = this.qrScanner.scan().subscribe(text => {
            // console.log('Scanned: ', text);
            this.storage.get('allBookDetails').then(param => {
              const scanIndex = param.findIndex(record => record.isbn === text);
              ionApp.style.display = 'block';
              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning
              this.qrScanner.hide();
              this.showDetails(scanIndex);
            });
          });
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  ionViewDidEnter() {
    this.storage.get('allBookDetails').then(param => {
      this.bookDetails = param;
      this.bookDetailsTemp = this.bookDetails;
    });
  }

  ionViewDidLeave() {
    window.document
      .querySelector('ion-app')
      .classList.remove('transparentBody');
  }
  loadFeedback() {
    window.open(
      'https://forms.gle/Mih4QxNF5SFedp1H8',
      '_system',
      'location=yes'
    );
    return false;
  }
}
