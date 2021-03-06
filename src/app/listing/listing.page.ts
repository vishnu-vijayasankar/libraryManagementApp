import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Storage } from '@ionic/storage';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, NavController } from '@ionic/angular';
import moment from 'moment';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss']
})
export class ListingPage implements OnInit {
  currentBook: any;
  allBookData: any;
  text: string;
  allEmpData: any;
  borrower: any;
  returnee: any;
  returnDate: any;
  currentDate: any;
  formattedDate: any;

  constructor(
    public shared: SharedService,
    public storage: Storage,
    private qrScanner: QRScanner,
    public alertController: AlertController,
    public navController: NavController
  ) {
    this.currentBook = [];
    this.borrower = [];
    this.returnee = [];
    storage.get('thisBookDetails').then(parameter => {
      this.currentBook = parameter;

      storage.get('allEmpDetails').then(param => {
        this.allEmpData = param;
        this.borrower = this.allEmpData.find(
          borrower => borrower.id === this.currentBook.borrower
        );
        this.returnee = this.allEmpData.find(
          returnee => returnee.id === this.currentBook.returnee
        );
      });
    });
    storage.get('allBookDetails').then(param => {
      this.allBookData = param;
    });
  }

  ngOnInit() {
    // this.currentBook = this.shared.thisBookDetails;
    // console.log(this.currentBook);
    // window.document.querySelector('ion-app').classList.add('transparentBody');
  }

  scanBook() {
    // Optionally request the permission early
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          var ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];

          // start scanning
          this.qrScanner.show();
          ionApp.style.display = 'none';
          let scanSub = this.qrScanner.scan().subscribe(text => {
            console.log('Scanned: ', text);
            ionApp.style.display = 'block';
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.qrScanner.hide();
          });
          // wait for user to scan something, then the observable callback will be called
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

  empPage() {
    // const obj = await this.allBookData.find(
    //   obj => obj.isbn == this.currentBook.isbn
    // );
    // const currentIndex = await this.allBookData.indexOf(obj);
    // this.allBookData[currentIndex].isAvailable = !this.allBookData[currentIndex]
    //   .isAvailable;
    // await this.storage.set('allBookDetails', this.allBookData);
    // await this.storage.set('thisBookDetails', this.allBookData[currentIndex]);
    this.navController.navigateForward('/employee-details');
  }

  // async bookReturn() {
  //   await this.bookBorrow();
  // }

  loadWebsite() {
    window.open(this.currentBook.website, '_system', 'location=yes');
    return false;
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {
    window.document
      .querySelector('ion-app')
      .classList.remove('transparentBody');
  }
}
