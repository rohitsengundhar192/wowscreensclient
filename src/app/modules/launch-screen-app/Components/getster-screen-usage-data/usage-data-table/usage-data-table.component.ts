import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import * as XLSX from 'xlsx';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { DateTime } from 'luxon';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/api/token.service';

export interface PeriodicElement {
  lwhours: string;
  lmhours: string;
  average: string;
  notuse: string;
}
@Component({
  selector: 'app-usage-data-table',
  templateUrl: './usage-data-table.component.html',
  styleUrls: ['./usage-data-table.component.scss'],
})
export class UsageDataTableComponent implements OnInit {
  //* ------------------------------  START  ------------------------------ *//

  //* ------------------------------  Decorated Methods  ------------------------------ *//

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;

  displayedColumns: string[] = ['lmhours', 'lwhours', 'average', 'notuse'];

  //* ------------------------------  Variable Declaration  ------------------------------ *//

  ELEMENT_DATA: PeriodicElement[] = [];

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  dataSource: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  filterValue = '';
  customer_id: any;
  user_id_login: any;
  country_code: any;
  scrren_id: any;
  //* ------------------------------  Constructor  ------------------------------ *//

  constructor(
    private _apiService: ApiService,
    private datashare: DataSharingService,
    private authService: JwtauthserviceService,
    private _snackbar: SnackBarService,
    private _tokenService: TokenService
  ) {}

  //* ------------------------------  Lifecycle Hooks  ------------------------------ *//
  datasoucedata: any;
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    //Add 'implements OnDestroy' to the class.
    this.dataSource.data = [];

    this.datashare.usage_datas_another_data.subscribe((res) => {
      if (res != undefined) {
        let tableData: any[] = [];
        if (res) {
          for (let i = 0; i < res.length; i++) {
            let datass = res[i];

            let datas = {
              to_calaulate: datass.to_calaulate[0].difference,
              wow_screen_avg_hrs_a_day:
                datass.wow_screen_avg_hrs_a_day[0].avg_no_of_hrs,
              wow_screen_last_months_hrs:
                datass.wow_screen_last_months_hrs[0].average_hours_per_day,
              wow_screen_last_week_hrs:
                datass.wow_screen_last_week_hrs[0].no_of_hrs,
            };

            tableData.push(datas);
          }
          this.dataSource.data = tableData;
        }
      }
    });
  }

  //* ------------------------------  APIs Methods  ------------------------------ *//

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
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
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

  @ViewChild('usageDataTable', { static: false }) usageDataTable!: ElementRef;
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
  //         <span style="text-align: center;font-size:16px;color:black;font-weight:600;">WOW SCREENs USAGE DATA</span>
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
    var printContents = document.getElementById('usageDataTable')!.innerHTML;
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
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;">WOW SCREENs USAGE DATA</span>
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
