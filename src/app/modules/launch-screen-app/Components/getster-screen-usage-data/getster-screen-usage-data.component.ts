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
import { LoginComponent } from 'src/app/shared/dialogs/login/login.component';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { OpenAnotherAppComponent } from './open-another-app/open-another-app.component';

export interface PeriodicElement {
  usagestatus: string;
  rentaldate: string;
}

@Component({
  selector: 'app-getster-screen-usage-data',
  templateUrl: './getster-screen-usage-data.component.html',
  styleUrls: ['./getster-screen-usage-data.component.scss'],
})
export class GetsterScreenUsageDataComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;

  displayedColumns: string[] = ['usagestatus', 'rentaldate'];

  country_code: any;
  customer_id: any;

  screen_id: number | undefined;
  screen_inch: number | undefined;
  btnDisabled = true;

  screenradio: any;

  data: any;
  ELEMENT_DATA: PeriodicElement[] = [];

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  hidecontent: boolean = false;
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  filterValue = '';
  user_id_login: any;
  registered_educational_institution_name: any;

  constructor(
    private table: ApiService,
    private _snackbar: SnackBarService,
    private datashare: DataSharingService,
    private authService: JwtauthserviceService,
    private dialog: MatDialog,
    private _header: HeaderTitleService,
    private _tokenService: TokenService
  ) {}

  showdate: any;
  ngOnInit(): void {
    this._header.setTitle(`GETster Screen Usage Data`);
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    this.registered_educational_institution_name =
      token.user.registered_educational_institution_name;

    this.table
      .getscreenregister(this.country_code, this.customer_id)
      .subscribe({
        next: (responce: any) => {
          if (responce.data?.length == 0) {
            this.showdate = 2;
            // this.openDialog()
            this._snackbar.success('Data Not Found','OK')
          } else {
            this.showdate = 1;
            this.hidecontent = false; // Show the HTML content
            this.dataSource.data = responce.data;
            this.btnDisabled = true;
            this.screenradio = undefined;
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
  //Api's
  getusagedata() {
    this.table
      .getscreenregister(this.country_code, this.customer_id)
      .subscribe({
        next: (responce: any) => {
          if (responce.data?.length == 0) {
            this._snackbar.success('Data Not Found', 'OK');
          }
          // if (responce.data?.final?.length == 0) {
          //   this._snackbar.success('Database and Table Not Found', 'OK');
          // }
          this.dataSource.data = responce.data;
          this.btnDisabled = true;
          this.screenradio = undefined;
        },
      });
  }
  screen_id_new: any;
  screen_inch_new: any;
  getusage(screenid: number, screeninch: number) {
    this.screen_id_new = screenid;
    this.screen_inch_new = screeninch;

    this.table.getusagedata(this.screen_id_new).subscribe({
      next: (response) => {
        if (response.data?.length == 0) {
          this._snackbar.success('Data Not Found', 'OK');
        }
        if (response.data?.final?.length == 0) {
          this._snackbar.success('Database and Table Not Found', 'OK');
        }
        this.datashare.UsageDataAnother(response.data);
      },
    });
  }

  //Table helpers

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.translateMatPaginator(this.paginator);
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

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.table
      .getscreenregister(this.country_code, this.customer_id)
      .subscribe({
        next: (responce: any) => {
          if (responce.data?.length == 0) {
            this.showdate = 2;
            // this.openDialog()
            this._snackbar.success('Data Not Found','OK')
          } else {
            this.showdate = 1;
            this.hidecontent = false; // Show the HTML content
            this.dataSource.data = responce.data;
            this.btnDisabled = true;
            this.screenradio = undefined;
          }
        },
      });
  }

  onRowClicked(row: any) {
    // this.value.emit(row);
  }

  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'First';
    paginator._intl.itemsPerPageLabel = 'Records Per Page';
    paginator._intl.lastPageLabel = 'Last';
    paginator._intl.nextPageLabel = 'Next';
    paginator._intl.previousPageLabel = 'Previous';
  }

  onPrint() {
    window.print();
  }

  @ViewChild('screenRegisterTable', { static: false })
  screenRegisterTable!: ElementRef;
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
  //         <span style="text-align: center;font-size:16px;color:black;font-weight:600;">GETster Screens registered in your Educational Institution</span>
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


  // public downloadAsPDF() {

  //   let jwt_token = localStorage.getItem('access_token');
  //   let token = this._tokenService.decodeJwtToken(jwt_token);

  //   let app_name: string = token.user.registered_educational_institution_name;
  //   let districtStatePincode: string = `${token.user.city_district_county} ${token.user.state_province} ${token.user.pin_code};`;
  //   let addressline1_adressline2: string = `${token.user.address_line_1} ${token.user.address_line_2}`;
  //   let customer_logo = `${environment.ceph_URL}${token.user.country_code}-${token.user.customer_id}/${token.user.customer_sub_domain_name}-icon-128x128.png`;
  //   console.log(customer_logo,'logo');

  //   let pageIndex: number = Number(this.paginator.pageIndex);
  //   let pageSize: number = Number(this.paginator.pageSize);

  //   let currentPageEnd = pageSize * (pageIndex + 1);
  //   let currentPageStart = currentPageEnd - (pageSize - 1);

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
  //   var printContents = document.getElementById('screenRegisterTable')!.innerHTML;
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
  //       '</style>' +
  //       `</head>

  //       <body onload="window.print()">
  //         <style>
  //         .mat-column-select{display:none}
  //         .mat-table{
  //           margin-left:auto;
  //           margin-right:auto;
  //          }
  //          .table thead th
  //          {
  //           color:#3366ff;
  //          }
  //         </style>

  //         <div style="width:100%;  display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">
  //         <img style="width:100px;height:100px" src="${customer_logo}" alt="app-logo" />
  //         <div style=" display: flex;flex-direction: column; width:100%">
  //           <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">${app_name}</span>
  //           <span style="text-align: center;font-size:16px;color:black;font-weight:600;">GETster Screens registered in your Educational Institution</span>
  //           <span style="text-align: center;font-size:14px;color:black;font-weight:600;">Records : ( ${currentPageStart} - ${currentPageEnd} of ${
  //         this.paginator.length
  //       } ) ${
  //         this.filterValue.length >= 1
  //           ? `(Filtered by -" ${this.filterValue} ")`
  //           : ''
  //       } (${DateTime.local().toFormat('d MMM y h:mm a')})</span>
  //         </div>
  //         </div>

  //         ` +
  //       printContents +
  //       '</body>' +
  //       `
  //       <footer style="position: fixed; bottom: 0; width: 100%;">
  //       <div style=" display: flex;flex-direction: column; width:100%; align-items:center">
  //       <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${addressline1_adressline2}</span>
  //       <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${districtStatePincode}</span>
  //       </div>
  //       </footer>
  //       ` +
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
    var printContents = document.getElementById('screenRegisterTable')!.innerHTML;
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
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;">GETster Screens registered in your Educational Institution</span>
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
