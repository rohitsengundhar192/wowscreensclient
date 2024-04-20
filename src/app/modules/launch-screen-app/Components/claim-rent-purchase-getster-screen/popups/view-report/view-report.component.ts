import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss'],
})
export class ViewReportComponent implements OnInit {
  //* ------------------------------  START  ------------------------------ *//

  //* ------------------------------  Variable Declaration  ------------------------------ *//

  screenid: number;

  reportform!: UntypedFormGroup;

  country_code: any;

  onAdd = new EventEmitter();
  user_id_login: any;
  customer_id: any;
  getster_screen_id: any;

  first_name: any;
  last_name: any;
  mobile_extension: any;
  mobile: any;
  faceid: any;
  normal: any;
  another: any;
  another_mobile_extension: any;
  another_mobile: any;

  isssueview: any;
  //* ------------------------------  Constructor  ------------------------------ *//

  constructor(
    private formbuilder: UntypedFormBuilder,
    private table: ApiService,

    public ReportIssueDialogRef: MatDialogRef<ViewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: JwtauthserviceService,
    private _snackbar: SnackBarService,
    private _spinner: CustomSpinnerService,
    private datashare: DataSharingService
  ) {
    this.screenid = data;

    this.reportform = this.formbuilder.group({
      issuedetail: ['', Validators.required],
    });
  }

  get issuedetail() {
    return this.reportform.get('issuedetail');
  }
  onNoClick(): void {
    this.ReportIssueDialogRef.close();
  }
  //* ------------------------------  Lifecycle Hooks  ------------------------------ *//

  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    this.getreportnumber();

    this.datashare.share_screen_id_for_issue_reported_data.subscribe((res) => {
      this.getster_screen_id = res;

      console.log(this.getster_screen_id, 'getster');
    });

    if (this.getster_screen_id != undefined) {
      this.table
        .getreportissuseview(this.getster_screen_id)
        .subscribe((res) => {
          this.isssueview = res.data[0].issue_in_detail;
          this.reportform.controls['issuedetail'].setValue(this.isssueview);
        });
    }
  }

  //* ------------------------------  APIs Methods  ------------------------------ *//
  getuserdetails() {
    this._spinner.open();
    this.table
      .getcliambooknewscreenuser(this.country_code, this.customer_id)
      .subscribe((res) => {
        console.log(res, 'r');

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

  getreportnumber() {
    this.table
      .getcliambooknewscreenuser(this.country_code, this.customer_id)
      .subscribe((res) => {
        console.log(res, 'res');

        if (res.data[0].normal.length != 0) {
          this._spinner.close();
          this.normal = res.data[0].normal[0];
          this.mobile_extension = this.normal.registered_mobile_country_code;
          this.mobile = this.normal.registered_mobile_number;
        }
      });
  }
  putreportissue() {
    let details: any = {
      screenid: this.getster_screen_id,
      issuedetail: this.reportform.get('issuedetail')?.value,
      issue_reported_by_user_id: this.user_id_login,
      issue_reported_by_customer_country_code: this.country_code,
      issue_reported_by_customer_id: this.customer_id,
      login_id: this.user_id_login,
    };

    this.table.putreportissue(this.country_code, details).subscribe({
      next: (res) => {
        if (res.statusCode == 200) {
          this._snackbar.success(res.message, 'OK');
        } else {
          this._snackbar.error(res.message, 'OK');
        }
        this.reportform.reset();
        this.onAdd.emit();
      },
    });

    this.ReportIssueDialogRef.close();
  }
}
