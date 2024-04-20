import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { ProvideProofOfDeliveryTwoComponent } from './provide-proof-of-delivery-two/provide-proof-of-delivery-two.component';
import { RandomNumberService } from 'src/app/shared/services/random-number/random-number.service';
import { LoginComponent } from 'src/app/shared/dialogs/login/login.component';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';

@Component({
  selector: 'app-provide-proof-of-delivery',
  templateUrl: './provide-proof-of-delivery.component.html',
  styleUrls: ['./provide-proof-of-delivery.component.scss'],
})
export class ProvideProofOfDeliveryComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  @ViewChild('action') scanner!: any;
  numbers: any;
  allow_access_camera: boolean = true;
  datas: any;
  scanData: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  pod_number: any;
  uniqueNumbers: any;
  randomNumber: number | undefined;
  showfirst: boolean = true;
  showsecond: boolean = false;
  hidecontent: boolean = false;
  user_registration_login_approval_status: any = 3;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private dialog: MatDialog,
    private _datashareing: DataSharingService,
    private table: ApiService,
    private _snackbar: SnackBarService,
    private authService: JwtauthserviceService,
    private randomNumberService: RandomNumberService,
    private _headertitle: HeaderTitleService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    this._headertitle.setTitle(`Provide Proof of Delivery for GETster Screens`);
    this._datashareing.updateAuditTrailData(2);
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    // this.user_registration_login_approval_status = token.user.user_registration_login_approval_status;

    if (this.user_registration_login_approval_status === 3) {
      console.log('showing html content');
      this.hidecontent = false; // Show the HTML content
    } else {
      console.log('open dialogue');
      this.hidecontent = true; // Hide the HTML content

      const dialogRef = this.dialog.open(LoginComponent, {
        disableClose: true,
        height: 'auto',
        width: '350px',
        minWidth: '350px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.hidecontent = this.user_registration_login_approval_status !== 3;
      });
    }
  }
  ngOnDestroy() {
    if (this._datashareing.updateAuditTrailData) {
      this._datashareing.updateAuditTrailData(undefined);
    }
  }
  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//

  //* ------------------------------ Helper Function -----------------------*//
  public handle(action: any, fn: string): void {
    action[fn]().subscribe((res: boolean) => console.log(fn + ': ' + res));
  }

  public onError(e: any): void {
    alert(e);
  }

  display_camera() {
    this.allow_access_camera = !this.allow_access_camera;
  }
  passdata: number = 1;
  onEvent(e: any) {
    if (e) {
      this.numbers = e;
      this.scanData = this.numbers.data;

      if (this.scanData.match(/^[0-9]+$/)) {
        if (this.scanData != undefined) {
          //Get api customer Register

          this.table
            .getscreenregisterclaim(this.country_code, this.customer_id)
            .subscribe({
              next: (res: any) => {
                let foundMatch = false; // Flag variable

                for (let i = 0; i < res.data.final.length; i++) {
                  const element = res.data.final[i];

                  if (element.screenid == this.scanData) {
                    foundMatch = true; // Set the flag to true if there is a match
                    console.log('works');
                    this.showfirst = false;
                    this.showsecond = true;

                    this.scanner.stop();
                    break; // Exit the loop since we found a match
                  }
                }

                if (!foundMatch) {
                  console.log('not works');
                  this.showfirst = true;
                  this.showsecond = false;
                  this._snackbar.success(
                    'Registered Screen Id and Scan Data are Mismatched',
                    'OK'
                  );
                  this.scanner.stop();
                }
              },
            });
        } else {
          this.scanner.stop();
          this.showfirst = true;
          this.showsecond = false;
          this._snackbar.success(
            'Selected Screen Id and Scan Data are Mismatched',
            'OK'
          );
        }
      } else {
        // Code to execute when this.screen_id is neither 55 nor 65
        this.scanner.stop();
        this.showfirst = true;
        this.showsecond = false;
        this._snackbar.success('Please Check Your QR-Code', 'OK');
      }
    }
  }
  btndisable: boolean = false;
  generateRandomNumber() {
    this.randomNumber = this.randomNumberService.getRandomNonDuplicateNumber();
    this.btndisable = true;

    setTimeout(() => {
      let body: any = {
        pod_number: this.randomNumber,
        getster_screen_id: this.scanData,
        login_id: this.user_id_login,
      };
      this.table
        .updatepodnumber(
          this.country_code,
          this.customer_id,
          this.user_id_login,
          body
        )
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this._snackbar.success(res.message, 'OK');
          } else {
            this._snackbar.error(res.message, 'OK');
          }
        });
    }, 1000);
    this.timer(1);
  }

  display: any;
  public timerInterval: any;

  stop() {
    clearInterval(this.timerInterval);
  }
  timer(minute: number) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(this.timerInterval);
        this.btndisable = false;
      }
    }, 1000);
  }
  //! -------------------------------  End  --------------------------------!//
}
