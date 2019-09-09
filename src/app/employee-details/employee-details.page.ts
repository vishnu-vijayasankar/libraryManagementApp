import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.page.html',
  styleUrls: ['./employee-details.page.scss']
})
export class EmployeeDetailsPage implements OnInit {
  public empId = '';
  public empName: string;
  public empMail: string;
  public empNum: string;
  public empBool = false;
  public showError = false;
  allBookData: any;
  allEmpData: any;
  currentBook: any;
  constructor(
    public navController: NavController,
    public storage: Storage,
    public toastController: ToastController
  ) {
    this.currentBook = [];
    storage.get('allBookDetails').then(param => {
      this.allBookData = param;
    });
    storage.get('allEmpDetails').then(param => {
      this.allEmpData = param;
    });
    storage.get('thisBookDetails').then(parameter => {
      this.currentBook = parameter;
    });
  }

  ngOnInit() {}

  fetchEmployee() {
    const emp = this.allEmpData.find(emp => emp.id == this.empId);
    if (emp) {
      this.empBool = true;
      this.empName = emp.firstName + ' ' + emp.lastName;
      this.empMail = emp.mail;
      this.empNum = emp.mobile;
    } else {
      this.showError = true;
      this.presentToast();
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Employee Not Found !!',
      duration: 2000
    });
    toast.present();
  }

  async updateBookData() {
    const obj = await this.allBookData.find(
      obj => obj.isbn == this.currentBook.isbn
    );
    const currentIndex = await this.allBookData.indexOf(obj);
    this.allBookData[currentIndex].isAvailable = !this.allBookData[currentIndex]
      .isAvailable;
    await this.storage.set('allBookDetails', this.allBookData);
    await this.storage.set('thisBookDetails', this.allBookData[currentIndex]);
    await this.navController.navigateForward('/home');
  }
}
