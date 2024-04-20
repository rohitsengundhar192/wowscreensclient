import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { environment } from 'src/environments/environment';
import { DataSharingService } from '../../services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-get-wallet-pop-up',
  templateUrl: './get-wallet-pop-up.component.html',
  styleUrls: ['./get-wallet-pop-up.component.scss'],
})
export class GetWalletPopUpComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('message') message!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('app_frame', { static: false }) appframe!: ElementRef;

  //* -----------------------  Variable Declaration  -----------------------*//

  iframeSource!: string;
  user_id: any;
  customer_id!: number;
  country_code!: string;
  dark!: string;
  app_name!: string;
  time_zone_iana_string!: string;
  debitamount: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public _dialogRef: MatDialogRef<GetWalletPopUpComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customSpinnerService: CustomSpinnerService,
    private _tokenService: TokenService,
    private _datashare: DataSharingService
  ) {}
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  async ngOnInit(): Promise<void> {
    // this.iframeSource = environment;
    let jwt_token = localStorage.getItem('access_token');
    let token = this._tokenService.decodeJwtToken(jwt_token);

    this.customer_id = token.user.customer_id;
    this.country_code = token.user.country_code;
    this.user_id = token.user.user_id;
    this.app_name = token.user.customer_sub_domain_name;
    this.time_zone_iana_string = token.user.time_zone_iana_string;

    this._datashare.share_wow_wmount_id_data.subscribe((res) => {
      this.debitamount = res;
    });
  }
  ngAfterViewInit(): void {
    this.iframeLoaded();
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//

  iframeLoaded() {
    let iframe: HTMLIFrameElement = this.appframe
      .nativeElement as HTMLIFrameElement;
    iframe.src = String(this.iframeSource).toString();
    this._customSpinnerService.open();

    // Send a message to the child iframe
    iframe.addEventListener('load', (e) => {
      let body = {
        // // access_token: localStorage.getItem('access_token'),
        // dark: this.dark,
        // customer_id: this.customer_id,
        // country_id: this.country_code,
        // total_debit_amount: parseInt(this.data.debit_entry_amount),//pay amount
        // transaction_type: 6,
        // debit_entry_amount: parseInt(this.data.debit_entry_amount),//pay amount
        // transaction_executed_by_user_id: parseInt(this.user_id), //login id
        // receiver_wallet_id: [null], //getster account
        // currency: this.data.currency, // get by token
        // app_name: this.app_name, // domain name obtained in the token
        // time_zone: this.time_zone_iana_string, //time_zone obtained in the token

        // //new added
        // get_wallet_model_id: 2, //2
        // customer_type: parseInt(this.data.customer_type), //get by token

        customer_id: this.customer_id,
        country_id: this.country_code,
        total_debit_amount: parseInt(this.debitamount),
        transaction_type: 6,
        debit_entry_amount: parseInt(this.debitamount),
        transaction_executed_by_user_id: this.user_id,
        receiver_wallet_id: [null],
        currency: 'INR',
        app_name: this.app_name,
        time_zone: this.time_zone_iana_string,
        camp_id: 1,
        camp_name: 'Hosur',

        //new added
        wow_wallet_model_id: this.user_id,
        customer_type: 2,
      };
      console.log(body);

      this.sendMessage(body, String(this.iframeSource).toString());
      this._customSpinnerService.close();
    });

    // Receive a message child to parent iframe

    window.addEventListener('message', (e) => {
      // console.log(e);
      // console.log(e.origin , this.iframeSource);
      // console.log(e.origin === this.iframeSource);

      if (e.origin === this.iframeSource) {
        if (e.data) {
          console.log('message from child GET Wallet', e.data);
          this._datashare.shareWowAmountgetId(e.data);
          setTimeout(() => {
            this._dialogRef.close({ event: 'close' });
          }, 5000);
        }
      }
    });
  }

  closeDialog() {
    this._dialogRef.close({ event: "close" });
    // const dialogRef = this.dialog.open(QrScanComponent, {
    //   disableClose: true,
    //   width: "420px",
    //   minHeight: "auto",
    // });
  }

  sendMessage(body: any, targetOrigin: string) {
    // Make sure you are sending a string, and to stringify JSON
    let iframeEl = this.appframe.nativeElement as HTMLIFrameElement;
    iframeEl.contentWindow?.postMessage(JSON.stringify(body), targetOrigin);
    // iframeEl.contentWindow.postMessage(body, '*');
  }

  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
