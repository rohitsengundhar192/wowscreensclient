import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { ClaimRentalWavierThreeComponent } from '../claim-rental-wavier-three/claim-rental-wavier-three.component';

@Component({
  selector: 'app-claim-rental-wavier-two',
  templateUrl: './claim-rental-wavier-two.component.html',
  styleUrls: ['./claim-rental-wavier-two.component.scss'],
})
export class ClaimRentalWavierTwoComponent implements OnInit {
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
  isAuto: boolean | undefined;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<ClaimRentalWavierTwoComponent>,
    private dialog: MatDialog,
    private _datashareing: DataSharingService,
    private table: ApiService,
    private _snackbar: SnackBarService,
    private authService: JwtauthserviceService
  ) {}
  screen_id: any;
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    this._datashareing.claim_rent_screen_id_data.subscribe((res) => {
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

  // onNoClick(): void {
  //   this.dialogRef.close(true);
  // }

  closeDialog() {
    this.loginDialogRef.close({ event: 'close', data: this.numbers });
    this.scanner.stop();
  }

  display_camera() {
    this.allow_access_camera = !this.allow_access_camera;
  }
  passdata: number = 1;
  onEvent(e: any) {
    if (e) {
      this.numbers = e;
      this.scanData = this.numbers.data;
      this._datashareing.getsterScreenIdDAta(this.scanData);
      if (this.scanData.match(/^[0-9]+$/)) {
        if (this.scanData) {
          //Get api customer Register
          this.table
            .getscreenregisterclaim(this.country_code, this.customer_id)
            .subscribe({
              next: (res: any) => {
                let foundMatch = false; // Flag variable

                for (let i = 0; i < res.data.final.length; i++) {
                  const element = res.data.final[i];
                  console.log(element.screenid, 'screen ids');
                  console.log(this.scanData, 'scanData');

                  if (element.screenid == this.scanData) {
                    foundMatch = true; // Set the flag to true if there is a match
                    console.log('works');

                    if (element.purchaserentaltype != 2) {
                      this._datashareing.qrCodeMovedata(this.scanData);
                      setTimeout(() => {
                        this.loginDialogRef.close({
                          event: 'close',
                          data: this.numbers,
                        });
                        const dialogRef = this.dialog.open(
                          ClaimRentalWavierThreeComponent,
                          {
                            disableClose: true,
                            height: 'auto',
                            width: '560px',
                            minWidth: '250px',
                          }
                        );
                        dialogRef.afterClosed().subscribe((result) => {
                          if (result == undefined) {
                            this._datashareing.dialogueCloseData(this.passdata);
                          }
                        });
                      }, 1000);
                      this.scanner.stop();
                      break; // Exit the loop since we found a match
                    } else {
                      console.log('direct purchase worked');
                      this.scanner.stop();
                      this._snackbar.success(
                        'Not to Extent Rental - Screen in type of Directly purchased ',
                        'OK'
                      );
                      this.loginDialogRef.close({
                        event: 'close',
                        data: this.numbers,
                      });
                    }
                  }
                }

                if (!foundMatch) {
                  console.log('not works');
                  this.scanner.stop();
                  this._snackbar.success(
                    'Registered Screen Id and Scan Data are Mismatched',
                    'OK'
                  );
                  this.loginDialogRef.close({
                    event: 'close',
                    data: this.numbers,
                  });
                }
              },
            });
          // this._datashareing.qrCodeMovedata(this.scanData);
          // setTimeout(() => {
          //   this.loginDialogRef.close({ event: 'close', data: this.numbers });
          //   const dialogRef = this.dialog.open(
          //     ClaimRentalWavierThreeComponent,
          //     {
          //       disableClose: true,
          //       height: 'auto',
          //       width: '560px',
          //       minWidth: '250px',
          //     }
          //   );
          //   dialogRef.afterClosed().subscribe((result) => {
          //     if (result == undefined) {
          //       this._datashareing.dialogueCloseData(this.passdata);
          //     }
          //   });
          // }, 1000);
          this.scanner.stop();
        } else {
          this.scanner.stop();
          this._snackbar.success(
            'Selected Screen Id and Scan Data are Mismatched',
            'OK'
          );
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
