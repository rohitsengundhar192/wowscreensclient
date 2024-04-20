import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GetWalletPopUpComponent } from 'src/app/shared/dialogs/get-wallet-pop-up/get-wallet-pop-up.component';
import { WowWalletPopUpComponent } from 'src/app/shared/dialogs/wow-wallet-pop-up/wow-wallet-pop-up.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-rent-two',
  templateUrl: './rent-two.component.html',
  styleUrls: ['./rent-two.component.scss'],
})
export class RentTwoComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  screen_id: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;

  wowtwomonths: any;
  regulartwomonths: any;

  wowquater: any;
  regularquater: any;

  wowyearly: any;
  regularyearly: any;

  response: any;

  isButtonDisabled = true;
  showbtn: boolean = true;
  getster_screen_id: any;
  customer_type: any = 1;
  wallet_transaction_id: any;

  date_duration: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<RentTwoComponent>,
    private _apiservice: ApiService,
    private _datashare: DataSharingService,
    private authService: JwtauthserviceService,
    private _snackbar: SnackBarService,
    private dialog: MatDialog
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    this._datashare.qrcode_move_id_data.subscribe((res) => {
      this.screen_id = res;

      this._datashare.shareWOWWalletScreenIdData(this.screen_id);

      // if (this.screen_id == 55 || this.screen_id == 65) {
      //Now Api
      this._apiservice
        .getqrcodedata(this.screen_id, this.country_code)
        .subscribe((res) => {
          this.response = res.data[0];

          if (this.response == undefined) {
            this._snackbar.success('Data Not Found', 'OK');
            this.showbtn = false;
          }
          this.regulartwomonths = this.response.regulartwomonths;
          this.regularquater = this.response.regualrquarterly;
          this.regularyearly = this.response.regularyearly;

          this.wowtwomonths = this.response.wowtwomonths;
          this.wowquater = this.response.wowquarterly;
          this.wowyearly = this.response.wowyearly;
        });
      // }
    });

    this._datashare.getster_screen_two_data.subscribe((res) => {
      this.getster_screen_id = res;
    });
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  wallet_transaction_id_static: any = 1;
  postpaywowrent() {
    if (this.identifywoworget == 1) {
      this.openget();
      console.log('Get Wallet');
    } else {
      // this.openwow();
      console.log('WOW Wallet');
      this.openwow();
      // if (this.wallet_transaction_id_static != undefined) {
      //   let body: any = {
      //     wallet_transaction_id: this.wallet_transaction_id_static,
      //     login_id: this.user_id_login,
      //   };
      //   this._apiservice
      //     .postpaywowrent(
      //       this.country_code,
      //       this.customer_id,
      //       this.screen_id,
      //       this.customer_type,
      //       this.date_duration,
      //       body
      //     )
      //     .subscribe((res) => {
      //       if (res.statusCode == 200) {
      //         this._snackbar.success(res.message, 'OK');
      //         this.onNoClick();
      //       } else {
      //         this._snackbar.error(res.message, 'OK');
      //       }
      //     });
      // }
    }
  }
  //* --------------------------  Public methods  --------------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
  }
  identifywoworget: any;
  rentalamount: any;
  enableButton(e: any, regularyearly: any, data: any) {
    this.date_duration = e;
    this._datashare.shareWOWWalletDateDuration(this.date_duration);
    this.identifywoworget = data;

    this.rentalamount = regularyearly;

    this._datashare.shareWowAmountId(this.rentalamount);

    this.isButtonDisabled = false;
  }

  //* ------------------------------ Helper Function -----------------------*//
  openwow() {
    const dialogRef = this.dialog.open(WowWalletPopUpComponent, {
      disableClose: true,
      height: 'auto',
      width: '360px',
      minWidth: '250px',
      data: this.date_duration,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.onNoClick();

    });
  }
  openget() {
    const dialogRef = this.dialog.open(GetWalletPopUpComponent, {
      disableClose: true,
      height: 'auto',
      width: '360px',
      minWidth: '250px',
      // data:row
    });
    dialogRef.afterClosed().subscribe((result) => {
      this._datashare.share_wow_wmount_get_id_data.subscribe((res) => {
        if (
          typeof res === 'string' &&
          res.startsWith('[') &&
          res.endsWith(']')
        ) {
          // Remove square brackets from the string and parse it as an integer
          this.wallet_transaction_id = parseInt(res.slice(1, -1), 10);
          console.log(this.wallet_transaction_id);
        } else {
          console.log('Invalid data format');
        }
      });

      if (this.wallet_transaction_id != undefined) {
        let body: any = {
          wallet_transaction_id: this.wallet_transaction_id,
          login_id: this.user_id_login,
        };
        this._apiservice
          .postpaywowrent(
            this.country_code,
            this.customer_id,
            this.getster_screen_id,
            this.customer_type,
            this.date_duration,
            body
          )
          .subscribe((res) => {
            if (res.statusCode == 200) {
              this._snackbar.success(res.message, 'OK');
              this.onNoClick();
            } else {
              this._snackbar.error(res.message, 'OK');
            }
          });
      }
      // }
    });
  }
  //! -------------------------------  End  --------------------------------!//
}
