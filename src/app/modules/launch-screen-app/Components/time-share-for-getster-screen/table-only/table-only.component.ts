import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatRadioButton } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import { Subscription, from } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { NewBookScreenComponent } from '../new-book-screen/new-book-screen.component';
import { EditBookScreenComponent } from '../edit-book-screen/edit-book-screen.component';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { Call } from '@angular/compiler';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
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
@Component({
  selector: 'app-table-only',
  templateUrl: './table-only.component.html',
  styleUrls: ['./table-only.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TableOnlyComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup3 = new FormGroup({
    date1: new FormControl(),
    date2: new FormControl(),
    selectdate: new FormControl('', Validators.required),
  });
  //* -----------------------  Decorated Methods  --------------------------*//

  @ViewChild('radio') radio!: MatRadioButton;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  //* -----------------------  Variable Declaration  -----------------------*//

  max: any = new Date().toISOString();
  ELEMENT_DATA: PeriodicElement[] = [];
  firstFormGroup: FormGroup;
  table_json_data: any;
  first: any;
  last_name: any;
  transferData$!: Subscription;
  value1: any;
  value2: any;
  maxDate!: Date;
  country_code: any;
  customer_id: any;
  user_id: any;
  user_id_login: any;
  selectedDate!: any;
  formattedDate: any;
  _format_date: any;
  selectedDateto!: any;
  formattedDateto: any;
  _format_dateto: any;
  defaultToDate: any;
  defaultFromDate: any;
  //* ---------------------------  Constructor  ----------------------------*//

  constructor(
    private _headerTitle: HeaderTitleService,
    private _apiService: ApiService,
    private _formBuilder: UntypedFormBuilder,
    private _dataSnack: SnackBarService,
    private _spinner: CustomSpinnerService,
    private _tokenService: TokenService,
    private dialog: MatDialog,
    private _dataShare: DataSharingService,
    private authService: JwtauthserviceService,
    private _header: HeaderTitleService
  ) {
    this.firstFormGroup = this._formBuilder.group({
      date: ['', Validators.required],
      firstCtrl: ['250 Rs.', Validators.required],
      date1: ['', Validators.required],
      date2: ['', Validators.required],
      qualification: ['', Validators.required],
    });
  }

  //* -------------------------  Lifecycle Hooks  --------------------------*//

  ngOnInit() {
    this._header.setTitle(`Time Share for GETster Screens`);
    // this._dataShare.updateAuditTrailData(3);
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    // Set the "from" date
    const formattedDateng = new Date();
    this.selectedDate = formattedDateng;
    this.formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');

    this.firstFormGroup3.controls['date1'].setValue(this.formattedDate);

    // Set the "to" date
    const formattedDatengto = new Date(); // Define formattedDatengto
    formattedDatengto.setDate(formattedDatengto.getDate() + 6); // Add 6 days to formattedDatengto
    this.selectedDateto = formattedDatengto;
    this.formattedDateto = formatDate(
      this.selectedDateto,
      'yyyy-MM-dd',
      'en-US'
    );

    this.firstFormGroup3.controls['date2'].setValue(this.formattedDateto);

    this.defaultFromDate = new Date();

    // Set defaultToDate to 7 days from defaultFromDate
    this.defaultToDate = new Date(this.defaultFromDate);
    this.defaultToDate.setDate(this.defaultFromDate.getDate() + 7);

    // Initialize from_date and to_date with default values
    this.from_date = formatDate(this.defaultFromDate, 'yyyy-MM-dd', 'en');
    this.to_date = formatDate(this.defaultToDate, 'yyyy-MM-dd', 'en');

    this.CallTableApi();
  }

  CallTableApi() {
    // Check if from_date is undefined, use defaultFromDate
    const fromDateToSend = this.from_date
      ? this.from_date
      : formatDate(this.defaultFromDate, 'yyyy-MM-dd', 'en');

    // Check if to_date is undefined, use defaultToDate
    const toDateToSend = this.to_date
      ? this.to_date
      : formatDate(this.defaultToDate, 'yyyy-MM-dd', 'en');

    this._apiService
      .gettableviewnormal(
        this.country_code,
        this.customer_id,
        fromDateToSend,
        toDateToSend
      )
      .subscribe((res) => {
        console.log('table only data');

        // Handle API response and update data accordingly
        if (res.statusCode == 200) {
          if (res.data.length === 0) {
            this.dataSource.data = [];
            this._spinner.close();
            this._dataSnack.success('Data Not Found', 'OK');
          } else {
            this._spinner.close();
            this.dataSource.data = res.data;
            console.log(res.data);
          }
        }
      });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.translateMatPaginator(this.paginator);
  }

  ngOnDestroy() {
    if (this.transferData$) {
      this.transferData$.unsubscribe();
    }
  }
  from_date: any;

  checkdata: any;
  checkdataFromDate: boolean = false;
  checkdataToDate: boolean = false;

  to_date: any;

  onDateSelected(event: any) {
    const selectedDate = event.value;
    console.log(selectedDate, 'sele');

    const formattedDate = formatDate(selectedDate, 'yyyy-MM-dd', 'en');
    this.from_date = formattedDate;
    this.CallTableApi();
    if (this.from_date != undefined) {
      this.checkdataFromDate = true;
    }
  }

  onDateSelectedto(event: any) {
    const selectedDate = event.value;
    const formattedDate = formatDate(selectedDate, 'yyyy-MM-dd', 'en');
    this.to_date = formattedDate;
    this.CallTableApi();
    if (this.to_date != undefined) {
      this.checkdataToDate = true;
    }
  }
  from_format_date: any;
  to_format_date: any;
  //* ----------------------------  APIs Methods  --------------------------*//
  value3: any;

  formatDate(dateStr: string): string {
    const dateParts = dateStr.split('-');
    const year = dateParts[0];
    const month = this.getMonthName(dateParts[1]);
    const day = dateParts[2];
    return `${day} ${month} ${year}`;
  }

  getMonthName(month: string): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[parseInt(month, 10) - 1];
  }

  loadData() {
    let jwt_token = localStorage.getItem('access_token');
    let token = this._tokenService.decodeJwtToken(jwt_token);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id = token.user.user_id;

    const date = new Date();
    this.maxDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  getCustomerProfileUrl(ceph_object_id: string) {
    let profileUrl =
      environment.ceph_URL +
      this.country_code +
      '-' +
      this.customer_id +
      '/' +
      ceph_object_id;
    return profileUrl;
  }

  //* --------------------------  Public methods  --------------------------*//
  btnDisabled = true;
  data: any;
  rowvalues: any;
  enable_edit(element: any) {
    this.btnDisabled = false;
    this.data = element;
    this.rowvalues = element;
  }
  radiohide: any;
  tables: any;
  openbookscreen(): void {
    const dialogRef = this.dialog.open(NewBookScreenComponent, {
      disableClose: true,
      width: '550px',
      height: '600px',
      // height: '800px',
      // data: this.selectCategory(),
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'resultS');
      this.tables = [];

      if (result?.data) {
        this._spinner.open();
        this.from_format_date = this.formatDate(this.formattedDate);
        this.to_format_date = this.formatDate(this.formattedDateto);

        this.CallTableApi();
      }
    });
  }
  openeditbookscreen(): void {
    const dialogRef = this.dialog.open(EditBookScreenComponent, {
      disableClose: true,
      width: '600px',
      // height: 'auto',
      height: '600px',
      data: this.data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.btnDisabled = true;
      if (result?.data) {
        this.CallTableApi();
        this.btnDisabled = true;
      }
    });
  }
  //* ------------------------------ Helper Function -----------------------*//

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

  displayedColumns: string[] = [
    'DateAndTime',
    'TransactionID',
    'Description',
    'TransactionType',
  ];

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
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.CallTableApi();
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
    // this.formattedDate=[];
    // this.formattedDateto=[];
    // this.from_date=[];
    // this.to_date=[];
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

            <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">WOW SCREENs BOOKING DATA FROM: "${
              this.from_format_date
            }" TO: "${this.to_format_date}" </span>
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

//! -------------------------------  End  --------------------------------!//
