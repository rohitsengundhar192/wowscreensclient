import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buy-new-screens',
  templateUrl: './buy-new-screens.component.html',
  styleUrls: ['./buy-new-screens.component.scss'],
})
export class BuyNewScreensComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  country_code: any;
  customer_id: any;
  user_id_login: any;

  first_name: any;
  last_name: any;
  mobile_extension: any;
  mobile: any;
  faceid: any;
  normal: any;
  another: any;
  another_mobile_extension: any;
  another_mobile: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<BuyNewScreensComponent>,
    private _apiservice: ApiService,
    private authService: JwtauthserviceService,
    private _spinner: CustomSpinnerService,
    private _snackbar: SnackBarService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    this.getuserdetails();
  }

  //* ----------------------------  APIs Methods  --------------------------*//
  getuserdetails() {
    this._spinner.open();
    this._apiservice
      .getcliambooknewscreenuser(this.country_code, this.customer_id)
      .subscribe((res) => {
        console.log(res, 'r');
        this._spinner.close();
        if (res.data[0].normal.length == 0) {
          this._spinner.close();
          this._snackbar.success('Data Not Found', 'ok');
        }

        if (res.data[0].normal[0] != undefined) {
          this._spinner.close();
        }

        if (res.data[0].normal.length != 0) {
          this._spinner.close();
          this.normal = res.data[0].normal[0];
          this.another = res.data[0].another[0];

          console.log(this.another, 'another');

          this.first_name = this.normal.first_name;
          this.last_name = this.normal.last_name;
          this.mobile_extension = this.normal.registered_mobile_country_code;
          this.mobile = this.normal.registered_mobile_number;
          this.faceid =
            this.normal.previous_login_image_of_the_day_ceph_object_id;

          this.another_mobile_extension =
            this.another.registered_mobile_country_code;
          this.another_mobile = this.another.registered_mobile_number;
        }
      });
  }
  //* --------------------------  Public methods  --------------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
  }
  //* ------------------------------ Helper Function -----------------------*//

  getProfileUrl(ceph_object_id: string) {
    let profileUrl = environment.ceph_URL + ceph_object_id;
    return profileUrl;
  }
  //! -------------------------------  End  --------------------------------!//
}
