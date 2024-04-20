import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  country_no: any = 'in';
  customer_id: any = '12';

  constructor(public loginDialogRef: MatDialogRef<LoginComponent>) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    localStorage.setItem('country_no', this.country_no);
    localStorage.setItem('customer_id', this.customer_id);
  }
  onNoClick(): void {
    this.loginDialogRef.close();
  }
  onsubmit() {}
}
