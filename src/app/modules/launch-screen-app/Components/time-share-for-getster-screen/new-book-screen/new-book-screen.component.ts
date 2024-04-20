import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MtxCalendarView,
  MtxDatetimepickerMode,
  MtxDatetimepickerType,
} from '@ng-matero/extensions/datetimepicker';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DateTime } from 'luxon';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/api/token.service';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

export interface PeriodicElement {
  screenid: number;
  screeninch: number;
}
export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-new-book-screen',
  templateUrl: './new-book-screen.component.html',
  styleUrls: ['./new-book-screen.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NewBookScreenComponent implements OnInit {
  //* ------------------------------  START  ------------------------------ *//

  //* ------------------------------  Decorated Methods  ------------------------------ *//

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;

  displayedColumns: string[] = ['screenid', 'screeninch'];

  //* ------------------------------  Variable Declaration  ------------------------------ *//

  bookeditform!: UntypedFormGroup;

  showSpinners = true;
  showSeconds = false;
  stepHour = 1;
  stepMinute = 1;
  stepSecond = 1;
  type: MtxDatetimepickerType = 'datetime';
  mode: MtxDatetimepickerMode = 'portrait';
  startView: MtxCalendarView = 'month';
  multiYearSelector = false;
  touchUi = false;
  twelvehour = false;
  timeInterval = 0;
  country_code: any;
  customer_id: any;
  user_id_login: any;
  user_id: any;
  truediv = true;
  falsediv = false;
  btnDisabled = true;
  data: any;
  screen_id: number | undefined;

  start_datetime: any;
  end_datetime: any;
  sdate: string | undefined;
  edate: string | undefined;
  startdate: any;
  enddate: any;

  dataSource: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  filterValue = '';

  public start_date!: Date;
  public end_date!: Date;
  public disabled = false;
  public enableMeridian = true;
  public from_date_time: any;
  public to_date_time: any;

  from_time(e: any) {
    // Get individual date and time components
    const year = e.getFullYear();
    const month = String(e.getMonth() + 1).padStart(2, '0');
    const date = String(e.getDate()).padStart(2, '0');
    const hours = String(e.getHours()).padStart(2, '0');
    const minutes = String(e.getMinutes()).padStart(2, '0');
    const seconds = String(e.getSeconds()).padStart(2, '0');

    // Format the output in the desired format
    const formattedTime = `${this.formattedDate} ${hours}:${minutes}:${seconds}`;
    this.from_date_time = formattedTime;
  }

  to_time(e: any) {
    // Get individual date and time components
    const year = e.getFullYear();
    const month = String(e.getMonth() + 1).padStart(2, '0');
    const date = String(e.getDate()).padStart(2, '0');
    const hours = String(e.getHours()).padStart(2, '0');
    const minutes = String(e.getMinutes()).padStart(2, '0');
    const seconds = String(e.getSeconds()).padStart(2, '0');

    // Format the output in the desired format
    const formattedTime = `${this.formattedDate} ${hours}:${minutes}:${seconds}`;
    this.to_date_time = formattedTime;
  }

  today: Date;
  //* ------------------------------  Constructor  ------------------------------ *//

  constructor(
    private formbuilder: UntypedFormBuilder,
    private table: ApiService,
    private authService: JwtauthserviceService,
    private _snackbar: SnackBarService,
    public loginDialogRef: MatDialogRef<NewBookScreenComponent>,
    private dateAdapter: DateAdapter<Date>,
    private _tokenService: TokenService
  ) {
    this.bookeditform = this.formbuilder.group({
      date1: [''],
      date2: [''],
    });
    this.today = new Date();
  }
  selectedDate!: any;
  formattedDate: any;
  _format_date: any;
  isDisabled_save_: boolean = true;
  showtimers: boolean = false;

  onDateChange(event: any) {
    if (event.length === undefined) {
      this.isDisabled_save_ = false;
      this.showtimers = true;

      // Set both start_date and end_date to the current time
      const currentTime = new Date();
      this.start_date = new Date(this.selectedDate);
      this.start_date.setHours(currentTime.getHours());
      this.start_date.setMinutes(currentTime.getMinutes());
      this.start_date.setSeconds(currentTime.getSeconds());

      this.end_date = new Date(this.selectedDate);
      this.end_date.setHours(currentTime.getHours());
      this.end_date.setMinutes(currentTime.getMinutes());
      this.end_date.setSeconds(currentTime.getSeconds());
    }

    this.formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
    console.log(this.formattedDate, 'formattedDate');
  }

  //* ------------------------------  Lifecycle Hooks  ------------------------------ *//

  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
  }

  //* ------------------------------  APIs Methods  ------------------------------ *//

  start_date_time: any;
  end_date_time: any;
  // Check Availability Pop Up
  checkavailability() {
    this._format_date = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
    this.start_datetime = this.from_date_time;
    this.end_datetime = this.to_date_time;
    this.start_date_time = `${this.start_datetime}`;
    this.end_date_time = `${this.end_datetime}`;

    if (this.start_date_time > this.end_date_time) {
      console.log('correct');
      this._snackbar.success('Selected Dates are Mis-Matched', 'OK');
    } else {
      console.log('not greatr');
      this.table
        .getavailablescreens(
          this.country_code,
          this.customer_id,
          this.start_date_time,
          this.end_date_time
        )
        .subscribe({
          next: (res: any) => {
            if (res.data?.length == 0) {
              this._snackbar.success('Data Not Found', 'OK');
            }
            // if (res.data?.available_screen_ids?.length == 0) {
            //   this._snackbar.success('Database and Table Not Found', 'OK');
            // }

            if (res.data.length != 0) {
              this.dataSource.data = res.data;

              this.truediv = true;
              this.falsediv = false;
            } else {
              this.truediv = false;
              this.falsediv = true;
            }
          },
        });
    }

    this.btnDisabled = true;
  }
  isDisabled_save_btn: boolean = true;
  daysSelected: any[] = [];
  daySeleted: any;
  ngDoCheck(): void {
    this.daySeleted = this.daysSelected[this.daysSelected.length - 1];
    const currentDate = new Date();
    const fromDateTime = new Date(this.from_date_time);
    // Check if the date is today and the time is in the past
    if (
      currentDate.toDateString() === fromDateTime.toDateString() &&
      currentDate.getTime() > fromDateTime.getTime()
    ) {
      this.isDisabled_save_btn = true;
    } else {
      // Check if from_date_time is greater than to_date_time
      this.isDisabled_save_btn = this.from_date_time >= this.to_date_time;
    }
  }

  selectscreen(screenid: any) {
    this.btnDisabled = false;
    this.screen_id = screenid.getster_screen_id;
  }

  bookscreen() {
    const details: any = {
      start_datetime: this.start_date_time,
      end_datetime: this.end_date_time,
      screen_id: this.screen_id,
      user_id: this.user_id,
    };

    this.table
      .postbookscreen(
        this.country_code,
        this.customer_id,
        this.user_id_login,
        details
      )
      .subscribe({
        next: (_res: any) => {
          if (_res.statusCode == 200) {
            this._snackbar.success(_res.message, 'OK');
            this.onNoClick();
          } else {
            this._snackbar.error(_res.message, 'OK');
          }
          // this.truediv = false;
          // this.falsediv = false;
        },
      });
    this.loginDialogRef.close({ event: true, data: 'true' });
  }

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

  translateMatPaginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = 'First';
    paginator._intl.itemsPerPageLabel = 'Records Per Page';
    paginator._intl.lastPageLabel = 'Last';
    paginator._intl.nextPageLabel = 'Next';
    paginator._intl.previousPageLabel = 'Previous';
  }

  onRowClicked(row: any) {
    // this.value.emit(row);
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
  @ViewChild('bookScreenTable', { static: false }) bookScreenTable!: ElementRef;
  public downloadAsPDF() {
    let pageIndex: number = Number(this.paginator.pageIndex);
    let pageSize: number = Number(this.paginator.pageSize);

    let currentPageEnd = pageSize * (pageIndex + 1);
    let currentPageStart = currentPageEnd - (pageSize - 1);
    let jwt_token = localStorage.getItem('access_token');
    let token1 = this._tokenService.decodeJwtToken(jwt_token);
    let app_name: string = token1.user.registered_educational_institution_name;
    let districtStatePincode: string = `${token1.user.city_district_county} ${token1.user.state_province} ${token1.user.pin_code};`;
    let addressline1_adressline2: string = ` ${token1.user.address_line_1} ${token1.user.address_line_2};`;
    let customer_logo = ` ${environment.ceph_URL}${token1.user.country_code}-${token1.user.customer_id}/${token1.user.customer_sub_domain_name}-icon-128x128.png`;

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
    var printContents = document.getElementById('bookScreenTable')!.innerHTML;
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
        '.mat-table {' +
        ' width: 40% ' +
        '}' +
        '.mat-radio-container {' +
        'display: none;' +
        '}' +
        '</style>' +
        `</head>

    <body onload="window.print()">
    <style>
    .mat-column-select{display:none}
    </style>

      <div style="width:100%;  display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">
      <img style="width:100px;height:100px" onerror="this.src='assets/logo.png'" src="${customer_logo}" alt="app-logo" />
      <div style=" display: flex;flex-direction: column; width:100%">
      <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">${app_name}</span>
        <span style="text-align: center;font-size:16px;color:black;font-weight:600;">Check Avalilable Screens</span>
        <span style="text-align: center;font-size:14px;color:black;font-weight:600;">Records : ( ${currentPageStart} - ${currentPageEnd} of ${
          this.paginator.length
        } ) ${
          this.filterValue.length >= 1
            ? `(Filtered by -" ${this.filterValue} ")`
            : ''
        } (${DateTime.local().toFormat('yyyy-MM-dd TT')})</span>
      </div>
      </div>

      ` +
        printContents +
        '</body>' +
        `
      <footer style="position: fixed; bottom: 0; width: 100%;">
      <div style=" display: flex;flex-direction: column; width:100%; align-items:center">
      <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${addressline1_adressline2} </span>
      <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">${districtStatePincode}</span>
      </div>
      </footer>
    ` +
        '</html>'
    );
    popupWin.document.close();
  }

  onNoClick(): void {
    this.loginDialogRef.close();
  }
}
