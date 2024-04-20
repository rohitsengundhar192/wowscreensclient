import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { PurchaseTwoComponent } from '../purchase-two/purchase-two.component';

@Component({
  selector: 'app-purchase-one',
  templateUrl: './purchase-one.component.html',
  styleUrls: ['./purchase-one.component.scss']
})
export class PurchaseOneComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  @ViewChild('action') scanner!: NgxScannerQrcodeComponent;
  numbers: any;
  allow_access_camera: boolean = true;
  datas: any;
  scanData: any;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<PurchaseOneComponent>,
    private dialog: MatDialog,
    private _datashareing:DataSharingService,
    private table:ApiService,
    private _snackbar:SnackBarService,
    private authService:JwtauthserviceService
  ) {}
  screen_id:any;
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    this._datashareing.claim_purchase_screen_id_data.subscribe((res) => {
      this.screen_id = res;
      console.log(this.screen_id, 'scrents');
    });
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
    this.scanner?.stop();
    this._datashareing.dialogueCloseData(this.passdata);
  }
  //* ------------------------------ Helper Function -----------------------*//
  public handle(action: any, fn: string): void {
    action[fn]().subscribe((res: boolean) => console.log(fn + ': ' + res));
  }

  public onError(e: any): void {
    alert(e);
  }


  closeDialog() {
    this.loginDialogRef.close({ event: 'close', data: this.numbers });
    this.scanner.stop();
  }

  display_camera() {
    this.allow_access_camera = !this.allow_access_camera;
  }

  passdata:any=1;
  onEvent(e: any) {
    // if (e) {
    //   this.numbers = e;
    //   this.scanData = this.numbers.data;
    //   this._datashareing.qrCodeMovedata(this.scanData);
    //   setTimeout(() => {
    //     this.loginDialogRef.close({ event: 'close', data: this.numbers });
    //     const dialogRef = this.dialog.open(PurchaseTwoComponent, {
    //       disableClose: true,
    //       // minWidth: '250px',
    //       height: 'auto',
    //       width: '560px',
    //       minWidth: '250px',
    //       // data: this.rowvalues,
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //       if (result == undefined) {
    //         this._datashareing.dialogueCloseData(this.passdata);
    //       }

    //     });
    //   }, 1000);
    //   this.scanner.stop();
    // }

    if (e) {
      this.numbers = e;
      this.scanData = this.numbers.data;
      if (this.scanData.match(/^[0-9]+$/)) {
        if (this.scanData == this.screen_id) {
          this._datashareing.qrCodeMovedata(this.scanData);
          setTimeout(() => {
            this.loginDialogRef.close({ event: 'close', data: this.numbers });
            const dialogRef = this.dialog.open(PurchaseTwoComponent, {
              disableClose: true,
              height: 'auto',
              width: '560px',
              minWidth: '250px',
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result == undefined) {
                this._datashareing.dialogueCloseData(this.passdata);
              }
            });
          }, 1000);
          this.scanner.stop();
        } else {
          this.scanner.stop();
          this._snackbar.success('Selected Screen Id and Scan Data are Mismatched', 'OK');
          this.loginDialogRef.close({ event: 'close', data: this.numbers });
        }
      } else {
        // Code to execute when this.screen_id is neither 55 nor 65
        this.scanner.stop();
        this._snackbar.success('Please Check Your QR-Code', 'OK');
        this.loginDialogRef.close({ event: 'close', data: this.numbers });
      }
    }
  }

  //! -------------------------------  End  --------------------------------!//
}
