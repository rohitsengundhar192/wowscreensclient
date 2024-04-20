import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';


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
export interface PeriodicElement {
  screenid: number;
  screeninch: number;
}
@Component({
  selector: 'app-edit-book-screen',
  templateUrl: './edit-book-screen.component.html',
  styleUrls: ['./edit-book-screen.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EditBookScreenComponent implements OnInit {
  //* ------------------------------  START  ------------------------------ *//
  firstFormGroup3 = new FormGroup({
    starttime: new FormControl(),
    endtime: new FormControl(),
    selectdate: new FormControl('', Validators.required),
    setradio: new FormControl(),
  });

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
    const year = e.getFullYear();
    const month = String(e.getMonth() + 1).padStart(2, '0');
    const date = String(e.getDate()).padStart(2, '0');
    const hours = String(e.getHours()).padStart(2, '0');
    const minutes = String(e.getMinutes()).padStart(2, '0');
    const seconds = String(e.getSeconds()).padStart(2, '0');
    // const formattedTime = `${hours}:${minutes}:${seconds}`;
    // this.from_date_time = formattedTime;

    // Format the output in the desired format
    const formattedTime = `${this.formattedDate} ${hours}:${minutes}:${seconds}`;
    this.from_date_time = formattedTime;
    
    if (this.from_date_time ) {
      this.btnDisabled = false;
    }
  }

  to_time(e: any) {
    const year = e.getFullYear();
    const month = String(e.getMonth() + 1).padStart(2, '0');
    const date = String(e.getDate()).padStart(2, '0');
    const hours = String(e.getHours()).padStart(2, '0');
    const minutes = String(e.getMinutes()).padStart(2, '0');
    const seconds = String(e.getSeconds()).padStart(2, '0');
    // const formattedTime = `${hours}:${minutes}:${seconds}`;
    // this.to_date_time = formattedTime;
    // Format the output in the desired format
    const formattedTime = `${this.formattedDate} ${hours}:${minutes}:${seconds}`;
    this.to_date_time = formattedTime;
    console.log(this.to_date_time, 'to_date_time');
  }

  today: Date;
  screen_id_get: any;
  booking_id_get: any;
  //* ------------------------------  Constructor  ------------------------------ *//

  constructor(
    private formbuilder: UntypedFormBuilder,
    private table: ApiService,
    private authService: JwtauthserviceService,
    private _snackbar: SnackBarService,
    public loginDialogRef: MatDialogRef<EditBookScreenComponent>,
    private dateAdapter: DateAdapter<Date>,
    public dialogRef: MatDialogRef<EditBookScreenComponent>,
    @Inject(MAT_DIALOG_DATA) public editdata: any,
    private formBuilder: FormBuilder,

    public MatDialogRef: MatDialogRef<EditBookScreenComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data1: any
  ) {
    this.bookeditform = this.formbuilder.group({
      date1: [''],
      date2: [''],
    });
    this.today = new Date();
  }

  //* ------------------------------  Lifecycle Hooks  ------------------------------ *//
  form!: FormGroup;
  openchangeendtime: any;
  obtainedScreenID: any;
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    this.screen_id_get = this.data1.screenid;
    this.booking_id_get = this.data1.booking_id;
    console.log(this.data1, 'data');

    // console.log(this.booking_id_get, 'booking_id_get');

    // console.log(this.editdata.booking_id,'edit');
    this.obtainedScreenID = this.editdata.screenid;

    //From time to set
    const dateString = this.data1.fromdate;
    const dateObj = new Date(dateString);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    const formattedTime_ng = `${hours}:${minutes}:${seconds}`;

    //to time to set
    const dateString1 = this.data1.todate;
    const dateObj1 = new Date(dateString1);
    const hours1 = String(dateObj1.getHours()).padStart(2, '0');
    const minutes1 = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds1 = String(dateObj.getSeconds()).padStart(2, '0');
    const formattedTime_ng1 = `${hours1}:${minutes1}:${seconds1}`;

    this.start_date = new Date(`2022-01-01T${formattedTime_ng}`);
    this.end_date = new Date(`2022-01-01T${formattedTime_ng1}`);
    this.openchangeendtime = formattedTime_ng1;

    //date to set
    const dateString2 = this.data1.todate;
    const dateObjs = new Date(dateString2);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedDateng = `${year}-${month}-${day}`;
    this.selectedDate = formattedDateng;
    this.formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
    this.firstFormGroup3.controls['selectdate'].setValue(this.formattedDate);
  }

  //* ------------------------------  APIs Methods  ------------------------------ *//

  start_date_time: any;
  end_date_time: any;
  // Check Availability Pop Up
  checkavailability() {
    this.start_datetime = this.from_date_time;
    this.end_datetime = this.to_date_time;
    this._format_date = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');

    this.start_date_time = `${this.start_datetime}`;
    this.end_date_time = `${this.end_datetime}`;
    console.log(this.start_date_time, this.end_date_time, 'both start and end');

    if (this.start_date_time > this.end_date_time) {
      this._snackbar.success('Selected Dates are Mis-Matched', 'OK');
      console.log(this.openchangeendtime, this.end_date_time, 'end');
    } else if (this.openchangeendtime < this.end_datetime) {
      console.log('greater works');
      this.firstFormGroup3.controls['setradio'].setValue(this.obtainedScreenID);
      this.table
        .getavailablescreensedit(
          this.country_code,
          this.customer_id,
          this.start_date_time,
          this.end_date_time,
          this.obtainedScreenID
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
    } else {
      console.log('other works');

      this.firstFormGroup3.controls['setradio'].setValue(this.screen_id_get);
      this.table
        .getavailablescreensedit(
          this.country_code,
          this.customer_id,
          this.start_date_time,
          this.end_date_time,
          this.screen_id_get
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

              console.log(res.data[0].other, 'data');

              if (res.data[0].other != undefined) {
                this.firstFormGroup3.controls['setradio'].setValue(null);
              }

              this.truediv = true;
              this.falsediv = false;
            } else {
              this.truediv = false;
              this.falsediv = true;
            }
          },
        });
    }

    // this.btnDisabled = true;
  }
  isDisabled_save_btn: boolean = true;
  daysSelected: any[] = [];
  daySeleted: any;

  ngDoCheck(): void {
    this.daySeleted = this.daysSelected[this.daysSelected.length - 1];

    const currentDate = new Date();
    let cur_date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');

    const fromDateTime = this.from_date_time;

    // Convert strings to Date objects for comparison
    const curDateObj = new Date(cur_date);
    const fromDateTimeObj = new Date(fromDateTime);

    // Adjust fromDateTimeObj by subtracting 5 minutes
    fromDateTimeObj.setMinutes(fromDateTimeObj.getMinutes() - 5);

    // Check if fromDateTime is in the past
    if (curDateObj > fromDateTimeObj) {
      this.isDisabled_save_btn = true;
    } else {
      this.isDisabled_save_btn = false;
    }
  }

  screen_id_id: any;
  selectscreen(screenid: any) {
    this.btnDisabled = false;

    this.screen_id_id = screenid.getster_screen_id;
    if (this.screen_id_id != undefined) {
      this.firstFormGroup3.controls['setradio'].setValue(null);
    }
  }

  editscreen() {
    if (this.screen_id_id > 0) {
      const details: any = {
        start_datetime: this.start_date_time,
        end_datetime: this.end_date_time,
        screen_id: this.screen_id_id,
        user_id: this.user_id,
        booking_id: this.booking_id_get,
        login_id: this.user_id_login,
      };

      this.table
        .updatescreen(
          this.country_code,
          this.customer_id,
          this.customer_id,
          details
        )
        .subscribe({
          next: (_res) => {
            if (_res.statusCode == 200) {
              this._snackbar.success(_res.message, 'OK');
              this.onNoClick();
            } else {
              this._snackbar.error(_res.message, 'OK');
            }
            // this.dialogref.close();
            this.loginDialogRef.close({ event: true, data: 'true' });
          },
        });
    } else {
      const details: any = {
        // start_datetime: this.sdate,
        // end_datetime: this.edate,
        start_datetime: this.start_date_time,
        end_datetime: this.end_date_time,
        screen_id: this.screen_id_get,
        user_id: this.user_id,
        booking_id: this.booking_id_get,
        login_id: this.user_id_login,
      };

      this.table
        .updatescreen(
          this.country_code,
          this.customer_id,
          this.customer_id,
          details
        )
        .subscribe({
          next: (_res) => {
            if (_res.statusCode == 200) {
              this._snackbar.success(_res.message, 'OK');
              this.onNoClick();
            } else {
              this._snackbar.error(_res.message, 'OK');
            }
            // this.dialogref.close();
            this.loginDialogRef.close({ event: true, data: 'true' });
          },
        });
    }
  }
  selectedDate!: any;
  formattedDate: any;
  _format_date: any;
  isDisabled_save_: boolean = true;
  showtimers: boolean = false;
  firstInitialData: any;
  changedThatInitialData: any;
  onDateChange(event: any) {
    // Store the initial formatted date if it hasn't been stored yet
    if (!this.firstInitialData) {
      this.firstInitialData = formatDate(
        this.selectedDate,
        'yyyy-MM-dd',
        'en-US'
      );
    }

    this.formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
    console.log(this.formattedDate, 'formattedDate');

    if (this.firstInitialData !== this.formattedDate) {
      // Change after any date is changed
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
    // this.loadData();
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
      <img style="width:100px;height:100px" src="../../../../../assets/icons/favicon.png" alt="app-logo" />
      <div style=" display: flex;flex-direction: column; width:100%">
        <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">GETster.TECH PVT.LTD</span>
        <span style="text-align: center;font-size:16px;color:black;font-weight:600;">WOW SCREENs BOOKING - AVAILABLE SCREENs</span>
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
      <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">Jr Plaza Fourth Floor, Tank Street, </span>
      <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500">Hosur, Tamil Nadu 635109</span>
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
