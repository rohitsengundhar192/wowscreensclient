import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { IframeService } from 'src/app/shared/services/iframe/iframe.service';
import { environment } from 'src/environments/environment';
import { DataSharingService } from '../../services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-wow-wallet-pop-up',
  templateUrl: './wow-wallet-pop-up.component.html',
  styleUrls: ['./wow-wallet-pop-up.component.scss'],
})
export class WowWalletPopUpComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('message') message!: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('app_frame', { static: false }) appFrame: ElementRef;

  //* -----------------------  Variable Declaration  -----------------------*//

  iframeSource: string;
  user_id: number;
  getster_id: number;
  _data: any;
  dark: boolean = false;
  jwt_token_send: any;
  debitamount: any;
  customer_id: any;
  country_code: any;
  app_name: any;
  time_zone_iana_string: any;
  obtainedScreenID:any;
  date_duration_data:any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private jwtService: JwtHelperService,
    private _iframeService: IframeService,
    public _dialogRef: MatDialogRef<WowWalletPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customSpinnerService: CustomSpinnerService,
    private _tokenService: TokenService,
    private _datashare: DataSharingService
  ) {}
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  async ngOnInit(): Promise<void> {
    this.iframeSource = environment.payment_options_india;
    this.jwt_token_send = localStorage.getItem('access_token');
    console.log(this.data, 'data');

    // this.customer_id = this.jwt_token_send.user.customer_id;
    // this.country_code = this.jwt_token_send.user.country_code;
    // this.user_id = this.jwt_token_send.user.user_id;
    // this.app_name = this.jwt_token_send.user.customer_sub_domain_name;
    // this.time_zone_iana_string = this.jwt_token_send.user.time_zone_iana_string;

    this._datashare.share_wow_wmount_id_data.subscribe((res) => {
      this.debitamount = res;
    });
    this._datashare.share_wow_wallet_screen_id_data.subscribe((res) => {
      this.obtainedScreenID = res;
      console.log(this.obtainedScreenID,'obtainedScreenID');
      
    });
    this._datashare.share_wow_wallet_date_duration_data.subscribe((res) => {
      this.date_duration_data = res;
      console.log(this.date_duration_data,'date_duration_data');
      
    });

    this._data = localStorage.getItem('access_token');
  }

  ngAfterViewInit(): void {
    this.iframeLoaded();
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//

  iframeLoaded() {
    let iframe: HTMLIFrameElement = this.appFrame
      .nativeElement as HTMLIFrameElement;
    iframe.src = String(this.iframeSource).toString();
    this._customSpinnerService.open();

    let jwt_token = localStorage.getItem('access_token');
    let is_dark = localStorage.getItem('dark') == 'true' ? true : false;

    // Send a message to the child iframe
    iframe.addEventListener('load', (e) => {
      let value: any = {
        // ------------------  static details ------------------------
        access_token: this.jwt_token_send,
        dark: is_dark,
        googleTranslate: localStorage.getItem('googleTranslate'),
        payment_type: 3, //payment type
        transaction_by_app_id: 25, // app id
        transaction_app_type: 0, // app type

        // ---------------  purchase wow details ---------------------

        debit_entry_amount: parseInt(this.debitamount), //amount //i have to change debit amount dynamically
        transaction_type: 16,

        // ---------------- wow app details ---------------------------
        purchase_wow_id: this.obtainedScreenID, //i have to change screen id dynamically
        screen_date_duration: this.date_duration_data, //i have to change screen_date_duration
        purchase_rental_type: 1,
      };

      this.sendMessage(value, String(this.iframeSource).toString());
      this._customSpinnerService.close();
    });

    // Receive a message child to parent iframe
    window.addEventListener('message', (e) => {
      if (e.origin === this.iframeSource) {
        if (e.data) {
          const transaction_details = JSON.parse(e.data);
          const is_iframe_closed = JSON.parse(e.data);
          if (is_iframe_closed.is_iframe_closed == true) {
            this._dialogRef.close();
          }
        }
      }
    });
  }

  sendMessage(body: any, targetOrigin: string) {
    // Make sure you are sending a string, and to stringify JSON
    let iframeEl: any = this.appFrame.nativeElement as HTMLIFrameElement;
    // window.parent.postMessage(JSON.stringify(body), targetOrigin);

    iframeEl.contentWindow.postMessage(JSON.stringify(body), targetOrigin);
    // iframeEl.contentWindow.postMessage(body, '*');
  }

  //* ------------------------------ Helper Function -----------------------*//
  closeDialog() {
    this._dialogRef.close({ event: "close" });
    // const dialogRef = this.dialog.open(QrScanComponent, {
    //   disableClose: true,
    //   width: "420px",
    //   minHeight: "auto",
    // });
  }
  //! -------------------------------  End  --------------------------------!//
}
