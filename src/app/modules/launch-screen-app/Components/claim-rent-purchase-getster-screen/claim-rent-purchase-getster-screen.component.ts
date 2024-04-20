import { Router } from '@angular/router';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import * as XLSX from 'xlsx';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { DateTime } from 'luxon';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { CKEditorComponent } from 'ng2-ckeditor';
import { FormBuilder, FormControl } from '@angular/forms';
import { RentOneComponent } from './popups/Rent/rent-one/rent-one.component';
import { PurchaseOneComponent } from './popups/Purchase/purchase-one/purchase-one.component';
import { ReportissueComponent } from './popups/reportissue/reportissue.component';
import { ClaimRentalWavierTwoComponent } from './popups/Claim Rental Wavier/claim-rental-wavier-two/claim-rental-wavier-two.component';
import { BuyNewScreensComponent } from './popups/buy-new-screens/buy-new-screens.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { OpenAnotherAppComponent } from '../getster-screen-usage-data/open-another-app/open-another-app.component';
import { ViewReportComponent } from './popups/view-report/view-report.component';
import { PurchaseTwoComponent } from './popups/Purchase/purchase-two/purchase-two.component';

export interface PeriodicElement {
  screenid: number;
  screeninch: number;
  mountingtype: string;
  usagestatus: string;
  rentaldate: string;
  waivedoff: string;
}

@Component({
  selector: 'app-claim-rent-purchase-getster-screen',
  templateUrl: './claim-rent-purchase-getster-screen.component.html',
  styleUrls: ['./claim-rent-purchase-getster-screen.component.scss'],
})
export class ClaimRentPurchaseGetsterScreenComponent implements OnInit {
  //* ------------------------------  START  ------------------------------ *//

  //* ------------------------------  Decorated Methods  ------------------------------ *//

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;

  displayedColumns: string[] = [
    'screenid',
    'screeninch',
    'mountingtype',
    'usagestatus',
    'rentaldate',
    'waivedoff',
  ];

  //* ------------------------------  Variable Declaration  ------------------------------ *//

  country_code: any;
  customer_id: any;

  screen_id: number | undefined;
  screen_inch: number | undefined;
  btnDisabled = true;

  screenradio: boolean = false;

  data: any;
  readonlydata: boolean = true;
  ELEMENT_DATA: PeriodicElement[] = [];

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  filterValue = '';
  registered_educational_institution_name: any;
  table_json_data: any;
  user_id_login: any;
  ckeConfig!: any;
  claimbtn: boolean = true;
  btndisable: boolean = true;
  outputData!: string;
  @ViewChild('myckeditor') myckeditor!: CKEditorComponent;
  @ViewChild('editorRef') editorRef: any;

  firstFormGroup = this._formBuilder.group({
    cdk_editor: new FormControl(),
    cdk_editor_1: new FormControl(),
    cdk_editor_2: new FormControl(),
  });
  //* ------------------------------  Constructor  ------------------------------ *//

  constructor(
    private _apiService: ApiService,
    private dialog: MatDialog,
    private route: Router,
    private table: ApiService,
    private datashare: DataSharingService,
    private authService: JwtauthserviceService,
    private _snackbar: SnackBarService,
    private _dataShare: DataSharingService,
    private _formBuilder: FormBuilder,
    private _header: HeaderTitleService,
    private _tokenService: TokenService
  ) {}

  //* ------------------------------  Lifecycle Hooks  ------------------------------ *//

  ngOnInit(): void {
    this._header.setTitle(
      `Claim Rental Waiver / Rent / Purchase GETster Screen`
    );
    this.datashare.updateAuditTrailData(2);
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    this.registered_educational_institution_name =
      token.user.registered_educational_institution_name;

    this.getscreenregister();

    this._dataShare.claim_rental_table_id_data.subscribe((res) => {
      if (res?.total_weight != undefined) {
        this.claimbtn = false;
      }
    });


    this._dataShare.reload_claim_rent_purchase_Table_check_data.subscribe((res)=>{
      console.log(res,'resreoad');
      if (res == 21) {
        this.reloadclaimwavierrental();
      }

    })

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      removePlugins: 'exportpdf',

      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        {
          name: 'paragraph',
          groups: [''],
        },
      ],
    };
  }

  ngOnDestroy() {
    if (this._dataShare.updateAuditTrailData) {
      this._dataShare.updateAuditTrailData(undefined);
    }
  }

  //* ------------------------------  APIs Methods  ------------------------------ *//
  showdate: any;
  getscreenregister() {
    this.table
      .getscreenregisterclaim(this.country_code, this.customer_id)
      .subscribe({
        next: (responce: any) => {
          if (responce.data?.final.length == 0) {
            this.showdate = 2;
            this.openDialog();
          } else {
            this.showdate = 1;
            this.dataSource.data = responce.data.final;
            this.btnDisabled = true;
            this.screenradio = true;
          }
          if (responce.data?.length == 0) {
            this._snackbar.success('Data Not Found', 'OK');
          }
        },
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OpenAnotherAppComponent, {
      disableClose: true,
      height: 'auto',
      width: '350px',
      minWidth: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed
    });
  }
  json: any = [];
  div: boolean = false;
  getusagedata(screenid: number, screeninch: number) {
    this.btnDisabled = false;
    this.screen_id = screenid;
    this.screen_inch = screeninch;
    this.datashare.ClaimBtnDisable([]);

    this._dataShare.claimRentScreenId(screenid);
    this._dataShare.ShareScreenInches(screeninch);

    this._dataShare.ShareSCreenIdforIssueReported(screenid);

    this._dataShare.claimRentalScreenId(this.screen_inch);
    this._dataShare.claimPurchaseScreenId(this.screen_inch);
    this._dataShare.claimClaimScreenId(screenid);

    if (screenid != undefined) {
      this.btndisable = false;
    }

    this.data = {
      screen_id: this.screen_id,
      screen_inch: this.screen_inch,
    };

    this._dataShare.downloadtestUserId(this.screen_inch);
    this.table.getusagedata(this.screen_id).subscribe({
      next: (response) => {
        if (response.data?.length == 0) {
          this._snackbar.success('Data Not Found', 'OK');
        }
        // if (response.data?.final?.length == 0) {
        //   this._snackbar.success('Database and Table Not Found', 'OK');
        // }
        this.datashare.UsageData(response.data);
      },
    });

    //table 3
    this.table.gettermsandcondition(screeninch).subscribe({
      next: (res) => {
        if (res.data?.length == 0) {
          this._snackbar.success('Data Not Found', 'OK');
        }

        this.firstFormGroup.controls['cdk_editor_1'].setValue(res.data.terms);
        this.outputData = res.data.terms;
        // if (res.data?.terms?.length == 0) {
        //   this._snackbar.success('Database and Table Not Found ', 'OK');
        // }

        this.div = true;
        this.json = res.data.terms;
      },
    });

    this.table.gettermsandconditionrentalwavier(screeninch).subscribe({
      next: (res) => {
        if (res.data?.length == 0) {
          this._snackbar.success('Data Not Found', 'OK');
        }

        this.firstFormGroup.controls['cdk_editor_2'].setValue(res.data.terms);
        this.outputData = res.data.terms;
        // if (res.data?.terms?.length == 0) {
        //   this._snackbar.success('Database and Table Not Found ', 'OK');
        // }

        this.div = true;
        this.json = res.data.terms;
      },
    });

    //table 4
    this.table.gettermsandconditionselling(screeninch).subscribe({
      next: (res) => {
        this.firstFormGroup.controls['cdk_editor'].setValue(res.data.terms);
        if (res.data?.length == 0) {
          this._snackbar.success('Data Not Found', 'OK');
        }
        // if (res.data?.terms?.length == 0) {
        //   this._snackbar.success('Database and Table Not Found ', 'OK');
        // }

        this.div = true;
        this.json = res?.data?.terms;
      },
    });
  }
  reportbtn: boolean = false;
  usagestatustype: any;
  purchasetype: any;
  rentpurchasebtn: boolean = false;
  disable(e: any) {
    console.log(e, 'ee');
    this.usagestatustype = e.usagestatustype;
    this.purchasetype = e.purchaserentaltype;
    this.datashare.ShareReportStatus(this.usagestatustype);
    if (this.usagestatustype == 2) {
      this.reportbtn = true;
    }

    if (this.purchasetype == 2) {
      this.rentpurchasebtn = true;
    }
  }
  EditMode: boolean = false;
  //* ------------------------------  Public Methods  ------------------------------ *//

  // Book New Screen Pop Up
  booknewscreen() {
    const dialogRef = this.dialog.open(BuyNewScreensComponent, {
      disableClose: true,
      // minWidth: '250px',
      height: 'auto',
      width: '560px',
      minWidth: '250px',
      // data: this.rowvalues,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.btndisable = true;

      this.datashare.ShareReportStatus(2);
      if (result?.data) {
        // this._dataShare.dialogue_close_id_data.subscribe((res) => {
        //   if (res == 1) {
        //     this.getscreenregister();
        //     this.btndisable = true;
        //     this.screenradio = false;
        //   }
        // });
      } else {
        // Dialog closed without any result, so unselect the mat-radio button
        // this.screenradio = false;
      }
    });
  }

  // Pay WOW Rental Pop Up
  paywowrental() {
    const dialogRef = this.dialog.open(RentOneComponent, {
      disableClose: true,
      // minWidth: '250px',
      height: 'auto',
      width: '560px',
      minWidth: '250px',
      // data: this.screen_id,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.btndisable = true;
      this.datashare.ShareReportStatus(2);
      this.datashare.ClaimBtnDisable(2);
      if (result?.data) {
        this._dataShare.dialogue_close_id_data.subscribe((res) => {
          if (res == 1) {
            this.getscreenregister();
            this.btndisable = true;
            this.screenradio = false;
          }
        });
      } else {
        // Dialog closed without any result, so unselect the mat-radio button
        this.screenradio = false;
      }
    });
  }
  reloadclaimwavierrental() {
    this._dataShare.reload_claim_rent_purchase_Table_data.subscribe((res) => {

        this.getscreenregister();

    });
  }
  // Pay Regular Rental Pop Up
  payregularrental() {
    const dialogRef = this.dialog.open(PurchaseTwoComponent, {
      disableClose: true,
      // minWidth: '250px',
      height: 'auto',
      width: '560px',
      minWidth: '250px',
      // data: this.rowvalues,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.btndisable = true;
      this.datashare.ShareReportStatus(2);
      if (result?.data) {
        this._dataShare.dialogue_close_id_data.subscribe((res) => {
          if (res == 1) {
            this.getscreenregister();
            this.btndisable = true;
            this.screenradio = false;
          }
        });
      } else {
        // Dialog closed without any result, so unselect the mat-radio button
        this.screenradio = false;
      }
    });
  }
  viewissue() {
    const dialogRef = this.dialog.open(ViewReportComponent, {
      disableClose: true,
      // minWidth: '250px',
      height: 'auto',
      width: '560px',
      minWidth: '250px',
      // data: this.rowvalues,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.btndisable = true;
      this.datashare.ClaimBtnDisable(2);
      this.datashare.ShareReportStatus(2);
      if (result?.data) {
        this.getscreenregister();
        this.screenradio = false;
      } else {
        // Dialog closed without any result, so unselect the mat-radio button
        this.screenradio = false;
      }
    });
  }

  // Report Issue Pop Up
  reportissue() {
    const dialogRef = this.dialog.open(ReportissueComponent, {
      disableClose: true,
      // minWidth: '250px',
      height: 'auto',
      width: '560px',
      minWidth: '250px',
      // data: this.rowvalues,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.datashare.ShareReportStatus(2);
      this.btndisable = true;
      this.datashare.ClaimBtnDisable(2);
      this.getscreenregister();

      console.log(result.data,'repot');

      if (result?.data) {
        this.table
          .getscreenregisterclaim(this.country_code, this.customer_id)
          .subscribe({
            next: (responce: any) => {
              if (responce.data?.final.length == 0) {
                this.showdate = 2;
                this.openDialog();
              } else {
                this.showdate = 1;
                this.dataSource.data = responce.data.final;
                this.btnDisabled = true;
                this.screenradio = true;
              }
              if (responce.data?.length == 0) {
                this._snackbar.success('Data Not Found', 'OK');
              }
            },
          });
        this.screenradio = false;
      } else {
        // Dialog closed without any result, so unselect the mat-radio button
        this.screenradio = false;
      }
    });
  }

  // Claim rental wavier

  //* ------------------------------  Helper Function  ------------------------------ *//

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.translateMatPaginator(this.paginator);

    // const editorInstance = this.myckeditor.instance;

    // // Make CKEditor content read-only
    // editorInstance.readOnly = true;
  }

  // loadData() {
  //   this._apiService
  //     .get_periodic_elements(this.currentPage, this.pageSize)
  //     .subscribe((res) => {
  //       this.table_json_data = res;
  //       this.dataSource.data = res.data.rows;

  //       setTimeout(() => {
  //         this.paginator.pageIndex = this.currentPage;
  //         this.paginator.length = res.data.count;
  //       });
  //     });
  // }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.loadData();
    this.getscreenregister();
  }

  onRowClicked(row: any) {
    // this.value.emit(row);
  }

  translateMatPaginator(paginator: MatPaginator) {
    if (paginator._intl != undefined) {
      paginator._intl.firstPageLabel = 'First';
      paginator._intl.itemsPerPageLabel = 'Records Per Page';
      paginator._intl.lastPageLabel = 'Last';
      paginator._intl.nextPageLabel = 'Next';
      paginator._intl.previousPageLabel = 'Previous';
    }
  }

  exportReport(fileName: any): void {
    /* pass here the table id */
    let element = document.getElementById('excel_table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  onPrint() {
    window.print();
  }

  @ViewChild('screenRegisterTable_1', { static: false })
  screenRegisterTable_1!: ElementRef;

  public downloadAsPDF() {

    let jwt_token = localStorage.getItem('access_token');
    let token = this._tokenService.decodeJwtToken(jwt_token);

    let app_name: string = token.user.registered_educational_institution_name;
    let districtStatePincode: string = `${token.user.city_district_county} ${token.user.state_province} ${token.user.pin_code};`;
    let addressline1_adressline2: string = `${token.user.address_line_1} ${token.user.address_line_2}`;
    let customer_logo = `${environment.ceph_URL}${token.user.country_code}-${token.user.customer_id}/${token.user.customer_sub_domain_name}-icon-128x128.png`;
    console.log(customer_logo,'logo');

    let pageIndex: number = Number(this.paginator.pageIndex);
    let pageSize: number = Number(this.paginator.pageSize);

    let currentPageEnd = pageSize * (pageIndex + 1);
    let currentPageStart = currentPageEnd - (pageSize - 1);

    const htmlToPrint =
      '' +
      '<style type="text/css">' +
      '.pageFooter {' +
      '    display: table-footer-group;' +
      '    counter-increment: page;' +
      '}' +
      '.pageFooter:after {' +
      '   content: "Page " counter(page)' +
      '}' +
      '</style>';
    var printContents = document.getElementById('screenRegisterTable_1')!.innerHTML;
    let popupWin: any = window.open(
      'Angular Large Table to pdf',
      '_blank',
      'width=768,height=auto'
    );

    popupWin.document.write(
      '<html><head>' +
        '<link rel="stylesheet" href="' +
        'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"/>' +
        '<style type="text/css">' +
        '.pageFooter {' +
        '    display: table-footer-group;' +
        '    counter-increment: page;' +
        '}' +
        '.pageFooter:after {' +
        '   content: "Page Number" counter(page)' +
        '}' +
        '</style>' +
        `</head>

        <body onload="window.print()">
          <style>
          .mat-column-select{display:none}
          .mat-table{
            margin-left:auto;
            margin-right:auto;
           }
           .table thead th
           {
            color:#3366ff;
           }
          </style>

          <div style="width:100%;  display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">
          <img style="width:100px;height:100px" src="${customer_logo}" alt="app-logo" />
          <div style=" display: flex;flex-direction: column; width:100%">
            <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">${app_name}</span>
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;">WOW SCREENs REGISTRATION AND USAGE VALIDITY DATA</span>
            <span style="text-align: center;font-size:14px;color:black;font-weight:600;">Records : ( ${currentPageStart} - ${currentPageEnd} of ${
          this.paginator.length
        } ) ${
          this.filterValue.length >= 1
            ? `(Filtered by -" ${this.filterValue} ")`
            : ''
        } (${DateTime.local().toFormat('d MMM y h:mm a')})</span>
          </div>
          </div>

          ` +
        printContents +
        '</body>' +
        `
        <footer style="position: fixed; bottom: 0; width: 100%;">
        <div style=" display: flex;flex-direction: column; width:100%; align-items:center">
        <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${addressline1_adressline2}</span>
        <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${districtStatePincode}</span>
        </div>
        </footer>
        ` +
        '</html>'
    );
    popupWin.document.close();
  }
}
//* ------------------------------  END  ------------------------------ *//
