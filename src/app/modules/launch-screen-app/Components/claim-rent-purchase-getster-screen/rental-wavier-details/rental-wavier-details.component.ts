import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import * as XLSX from 'xlsx';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
// import { ClaimRentalWavierTwoComponent } from '../popups/Claim Rental Wavier/claim-rental-wavier-two/claim-rental-wavier-two.component';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { ClaimRentalWavierNotRegComponent } from '../popups/Claim Rental Wavier/claim-rental-wavier-not-reg/claim-rental-wavier-not-reg.component';
import { ClaimRentalWavierTwoComponent } from '../popups/Claim Rental Wavier/claim-rental-wavier-two/claim-rental-wavier-two.component';
// import { ClaimRentalWavierNotRegComponent } from '../popups/Claim Rental Wavier/claim-rental-wavier-not-reg/claim-rental-wavier-not-reg.component';
@Component({
  selector: 'app-rental-wavier-details',
  templateUrl: './rental-wavier-details.component.html',
  styleUrls: ['./rental-wavier-details.component.scss'],
})
export class RentalWavierDetailsComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //* -----------------------  Variable Declaration  -----------------------*//
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  filterValue = '';
  displayedColumns: string[] = ['col1', 'col2', 'col6', 'col5', 'col4', 'col3'];
  rowValue: any[] = [];
  country_code: any;
  customer_id: any;
  user_id_login: any;
  cliambtnid: boolean = true;
  getster_screen_id: any;
  checkcliambtnmonths: boolean = true;
  reportbtn: boolean = false;
  screen_inches: any;
  floor = Math.floor;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _apiService: ApiService,
    private authService: JwtauthserviceService,
    private _datashareing: DataSharingService,
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

    this.gettablecliamwavier();

    // this._datashareing.dialogue_close_id_data.subscribe((res) => {
    //   if (res == 1) {
    //     this.gettablecliamwavier();
    //   }
    // });

    this._datashareing.claimbtn_disable_data.subscribe((res) => {
      console.log(res, 'resta');
      if (res == 2) {
        this.reportbtn = true;
      } else {
        this.reportbtn = false;
      }
    });
    this._datashareing.getster_screen_two_data.subscribe((res) => {
      this.getster_screen_id = res;
      // console.log(this.getster_screen_id,'climget');

      if (this.getster_screen_id != undefined) {
        this.cliambtnid = false;
      }
    });

    this._datashareing.share_screen_inches_data.subscribe((res) => {
      this.screen_inches = res;
    });
  }
  change: any;
  notsigned: any;
  //* ----------------------------  APIs Methods  --------------------------*//
  gettablecliamwavier() {
    this._apiService
      .getclaimrentaltable(this.country_code, this.customer_id)
      .subscribe((res) => {
        this._datashareing.claimRentaltableData(res.data[0]);
        this.dataSource.data = res.data;
        console.log(res.data, 'cliam');

        if (res.data == 5) {
          this.notsigned = 5;
        } else {
          this.notsigned = 1;
        }

        this.change = this.dataSource.data[0];
        if (this.change?.pendingmonthstobeclimbed == 0) {
          this.checkcliambtnmonths = true;
        } else {
          this.checkcliambtnmonths = false;
        }

        if (this.change != undefined) {
          this.claimbtn = false;
        }
      });
  }

  //* --------------------------  Public methods  --------------------------*//
  claimbtn: boolean = true;
  claimrentalwavier() {
    const dialogRef = this.dialog.open(ClaimRentalWavierTwoComponent, {
      disableClose: true,
      // minWidth: '250px',
      height: 'auto',
      width: '560px',
      minWidth: '250px',
      // data: this.rowvalues,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.btndisable = true;
      if (result?.data) {
        this._datashareing.dialogue_close_id_data.subscribe((res) => {
          if (res == 1) {
            this.gettablecliamwavier();
            // this.btndisable = true;
            this.claimbtn = true;
            this.cliambtnid = true;
          }
        });
      }
    });
  }

  claimrentalwaviernotsign() {
    const dialogRef = this.dialog.open(ClaimRentalWavierNotRegComponent, {
      disableClose: true,
      // minWidth: '250px',
      height: 'auto',
      width: '400px',
      minWidth: '250px',
      // data: this.rowvalues,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.btndisable = true;
      if (result?.data) {
        this._datashareing.dialogue_close_id_data.subscribe((res) => {
          if (res == 1) {
            this.gettablecliamwavier();
            // this.btndisable = true;
            this.claimbtn = true;
            this.cliambtnid = true;
          }
        });
      }
    });
  }
  //* ------------------------------ Helper Function -----------------------*//
  dataSource: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    this.rowValue = this.selection.selected;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.translateMatPaginator(this.paginator);
  }
  ngDoCheck(): void {
    if (this.selection.selected.length <= 0) {
      this.rowValue = [];
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    // this.gettabledata();
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

    var xlsx_cols = [
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 10 },
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
    ];
    ws['!cols'] = xlsx_cols;
    XLSX.writeFile(wb, fileName, { type: 'buffer' });
  }
  onPrint() {
    window.print();
  }
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  // public downloadAsPDF() {
  //   let pageIndex: number = Number(this.paginator.pageIndex);
  //   let pageSize: number = Number(this.paginator.pageSize);

  //   let currentPageEnd = pageSize * (pageIndex + 1);
  //   let currentPageStart = currentPageEnd - (pageSize - 1);
  //   let jwt_token = localStorage.getItem('access_token');
  //   let token1 = this._tokenService.decodeJwtToken(jwt_token);
  //   console.log(token1);

  //   let app_name: string = token1.user.registered_educational_institution_name;
  //   let districtStatePincode: string = `${token1.user.city_district_county} ${token1.user.state_province} ${token1.user.pin_code};`;
  //   let addressline1_adressline2: string = ` ${token1.user.address_line_1} ${token1.user.address_line_2};`;
  //   let customer_logo = ` ${environment.ceph_URL}${token1.user.country_code}-${token1.user.customer_id}/${token1.user.customer_sub_domain_name}-icon-128x128.png`;

  //   const htmlToPrint =
  //     '' +
  //     '<style type="text/css">' +
  //     '.pageFooter {' +
  //     '    display: table-footer-group;' +
  //     '    counter-increment: page;' +
  //     '}' +
  //     '.pageFooter:after {' +
  //     '   content: "Page " counter(page)' +
  //     '}' +
  //     '</style>';
  //   var printContents = document.getElementById(
  //     'screenRegisterTable'
  //   )!.innerHTML;
  //   let popupWin: any = window.open(
  //     'Angular Large Table to pdf',
  //     '_blank',
  //     'width=768,height=auto'
  //   );

  //   popupWin.document.write(
  //     '<html><head>' +
  //       '<link rel="stylesheet" href="' +
  //       'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"/>' +
  //       '<style type="text/css">' +
  //       '.pageFooter {' +
  //       '    display: table-footer-group;' +
  //       '    counter-increment: page;' +
  //       '}' +
  //       '.pageFooter:after {' +
  //       '   content: "Page Number" counter(page)' +
  //       '}' +
  //       '.mat-table {' +
  //       ' width: 80% ' +
  //       '}' +
  //       '.mat-radio-container {' +
  //       'display: none;' +
  //       '}' +
  //       '</style>' +
  //       `</head>

  //     <body onload="window.print()">
  //     <style>
  //     .mat-column-select{display:none}
  //     </style>

  //       <div style="width:100%;  display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">
  //       <img style="width:100px;height:100px" onerror="this.src='assets/logo.png'" src="${customer_logo}" alt="app-logo" />
  //       <div style=" display: flex;flex-direction: column; width:100%">
  //       <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">${app_name}</span>
  //         <span style="text-align: center;font-size:16px;color:black;font-weight:600;">Rental Wavier Details</span>
  //         <span style="text-align: center;font-size:14px;color:black;font-weight:600;">Records : ( ${currentPageStart} - ${currentPageEnd} of ${
  //         this.paginator.length
  //       } ) ${
  //         this.filterValue.length >= 1
  //           ? `(Filtered by -" ${this.filterValue} ")`
  //           : ''
  //       } (${DateTime.local().toFormat('yyyy-MM-dd TT')})</span>
  //       </div>
  //       </div>

  //       ` +
  //       printContents +
  //       '</body>' +
  //       `
  //       <footer style="position: fixed; bottom: 0; width: 100%;">
  //       <div style=" display: flex;flex-direction: column; width:100%; align-items:center">
  //       <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${addressline1_adressline2} </span>
  //       <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${districtStatePincode}</span>
  //       </div>
  //       </footer>
  //     ` +
  //       '</html>'
  //   );
  //   popupWin.document.close();
  // }

  public downloadAsPDF() {
    let jwt_token = localStorage.getItem('access_token');
    let token = this._tokenService.decodeJwtToken(jwt_token);

    let app_name: string = token.user.registered_educational_institution_name;
    let districtStatePincode: string = `${token.user.city_district_county} ${token.user.state_province} ${token.user.pin_code};`;
    let addressline1_adressline2: string = `${token.user.address_line_1} ${token.user.address_line_2}`;
    let customer_logo = `${environment.ceph_URL}${token.user.country_code}-${token.user.customer_id}/${token.user.customer_sub_domain_name}-icon-128x128.png`;
    console.log(customer_logo, 'logo');

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
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;">Rental Wavier Details</span>
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
  //! -------------------------------  End  --------------------------------!//
}

export interface PeriodicElement {
  col1: number;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
  col6: string;
}
