import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { RandomNumberService } from 'src/app/shared/services/random-number/random-number.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-provide-proof-of-delivery-two',
  templateUrl: './provide-proof-of-delivery-two.component.html',
  styleUrls: ['./provide-proof-of-delivery-two.component.scss'],
})
export class ProvideProofOfDeliveryTwoComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  country_code: any;
  customer_id: any;
  user_id_login: any;
  pod_number: any;
  uniqueNumbers: any;
  randomNumber: number | undefined;
  btndisable: boolean = true;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private authService: JwtauthserviceService,
    private _apiservice: ApiService,
    private _snackbar: SnackBarService,
    private randomNumberService: RandomNumberService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  updatepodnumber() {
    let body: any = {
      pod_number: this.pod_number,
      login_id: this.user_id_login,
    };
    this._apiservice
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
  }
  //* --------------------------  Public methods  --------------------------*//

  //* ------------------------------ Helper Function -----------------------*//
  generateRandomNumber() {
    this.randomNumber = this.randomNumberService.getRandomNonDuplicateNumber();

  }
  


  //! -------------------------------  End  --------------------------------!//
}
