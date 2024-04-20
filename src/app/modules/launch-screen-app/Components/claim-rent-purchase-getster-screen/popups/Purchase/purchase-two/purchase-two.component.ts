import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioButton } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { GetWalletPopUpComponent } from 'src/app/shared/dialogs/get-wallet-pop-up/get-wallet-pop-up.component';
import { WowWalletPopUpComponent } from 'src/app/shared/dialogs/wow-wallet-pop-up/wow-wallet-pop-up.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';

import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import * as XLSX from 'xlsx';
import { MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-purchase-two',
  templateUrl: './purchase-two.component.html',
  styleUrls: ['./purchase-two.component.scss'],
})
export class PurchaseTwoComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('radio') radio!: MatRadioButton;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

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
  getster_screen_id: any;
  customer_type: any = 1;
  wallet_transaction_id: any = 1;
  date_duration: any;
  screen_inche:any;
  identifywoworget: any;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<PurchaseTwoComponent>,
    private _apiservice: ApiService,
    private _datashare: DataSharingService,
    private authService: JwtauthserviceService,
    private _snackbar: SnackBarService,
    private dialog: MatDialog,
    private _tokenService: TokenService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;


    this._datashare.claim_purchase_screen_id_data.subscribe((res) => {
      this.screen_inche = res;
      console.log(this.screen_inche, 'scrents');
    });

    this._datashare.qrcode_move_id_data.subscribe((res) => {
      this.screen_id = res;
    });

    this._datashare.getster_screen_two_data.subscribe((res) => {
      this.getster_screen_id = res;
    });
    this.gettable();
  }

  data_json: any = [
    {
      screen_inch: 55,
      price: 3000,
    },
    {
      screen_inch: 65,
      price: 6000,
    },
  ];

  //* ----------------------------  APIs Methods  --------------------------*//
  gettable() {
    this._apiservice
      .getsellingdetails(this.screen_inche, this.country_code)
      .subscribe({
        next: (response) => {
          console.log(response.data[0].yearly1, 'res');

          if (response.data?.length == 0) {
            this._snackbar.success('Data Not Found', 'OK');
          }
          this._datashare.shareWowAmountId(response.data[0].yearly1);
          this.isButtonDisabled = false;

          this.dataSource.data = response.data;
        },
      });

    this.dataSource.data = this.data_json;
  }
  postpaywowrent() {
    if (this.identifywoworget == 1) {
      this.openget();
      console.log('Get Wallet');
    } else {
      this.openwow();
      console.log('WOW Wallet');
    }
  }
  postpaywowrente() {
    let body: any = {
      wallet_transaction_id: this.wallet_transaction_id,
      login_id: this.user_id_login,
    };
    this._apiservice
      .postpaywowpurchase(
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
  //* --------------------------  Public methods  --------------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
  }
  rentalamount: any;
  enableButton(e: any, regularyearly: any, data: any) {
    this.date_duration = e;
    this.identifywoworget = data;

    this.rentalamount = regularyearly;

    this.isButtonDisabled = false;
    this._datashare.shareWowAmountId(this.rentalamount);
  }
  //* ------------------------------ Helper Function -----------------------*//
  openwow() {
    const dialogRef = this.dialog.open(WowWalletPopUpComponent, {
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
          .postpaywowpurchase(
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
          .postpaywowpurchase(
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
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  displayedColumns: string[] = ['col1', 'col2'];

  dataSource: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  rowValue: any[] = [];

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // console.log(this.selection.selected);
    this.rowValue = this.selection.selected;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  ngDoCheck(): void {
    if (this.selection.selected.length <= 0) {
      this.rowValue = [];
    }
  }

  pageChanged(event: PageEvent) {
    // console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }
  showPageSizeOptions: boolean = true;

  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'First';
    paginator._intl.itemsPerPageLabel = 'Records Per Page';
    paginator._intl.lastPageLabel = 'Last';
    paginator._intl.nextPageLabel = 'Next';
    paginator._intl.previousPageLabel = 'Previous';
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

  public downloadAsPDF() {
    let jwt_token = localStorage.getItem('access_token');
    let token = this._tokenService.decodeJwtToken(jwt_token);

    let app_name: string = token.user.registered_educational_institution_name;
    let districtStatePincode: string = `${token.user.city_district_county} ${token.user.state_province} ${token.user.pin_code};`;
    let addressline1_adressline2: string = `${token.user.address_line_1} ${token.user.address_line_2}`;
    let customer_logo = `${environment.ceph_URL}/${token.user.country_code}-${token.user.customer_id}/${token.user.customer_sub_domain_name}-icon-128x128.png`;

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
    var printContents = document.getElementById('pdfTable')!.innerHTML;
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
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
