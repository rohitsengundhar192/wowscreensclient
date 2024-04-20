import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { MatDialog } from '@angular/material/dialog';
import { ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { DateTime } from 'luxon';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';

@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.scss'],
})
export class ShowTableComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup3 = new FormGroup({
    date1: new FormControl(),
    date2: new FormControl(),
    selectdate: new FormControl('', Validators.required),
  });
  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  country_code: any;
  customer_id: any;
  user_id_login: any;

  // tableform!: UntypedFormGroup;

  from_date: any;
  to_date: any;
  pageSize = 5;
  currentPage = 0;
  startdate: any;
  enddate: any;

  data: any;

  btnDisabled = true;
  table_view: boolean = true;

  ELEMENT_DATA: PeriodicElement[] = [];

  totalRows = 5;

  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private dialog: MatDialog,
    private _api_service: ApiService,
    private authService: JwtauthserviceService,
    private data_share: DataSharingService,
    private formbuilder: UntypedFormBuilder,
    private _snackbar: SnackBarService,
    private _header: HeaderTitleService,
    private _dataShare: DataSharingService,
    private _tokenService: TokenService,
    private _spinner: CustomSpinnerService,
    private cdRef: ChangeDetectorRef
  ) {
    this.firstFormGroup3 = this.formbuilder.group({
      date1: [''],
      date2: [''],
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
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

    this._spinner.open();
    this.dataSource.data = [];
    this._api_service
      .gettableview(
        this.country_code,
        this.customer_id,
        this.formattedDate,
        this.formattedDateto,
        this.currentPage,
        this.pageSize
      )
      .subscribe((res) => {
        this.datasoucedata = res.data;
        let tableData: any[] = [];

        if (res) {
          for (let i = 0; i < this.datasoucedata.length; i++) {
            let datass = this.datasoucedata[i];
            let datas = {
              start_time: datass.fromdate,
              end_time: datass.todate,
              duration: datass.duration,
              getster_id: datass.screenid,
            };

            tableData.push(datas);
          }
          this.dataSource.data = tableData;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = res.data[0]?.countt;
          }, 0);
          this._spinner.close();
        }
      });
  }
  selectedDateto: any;
  formattedDateto: any;
  ngOnDestroy() {
    if (this._dataShare.updateAuditTrailData) {
      this._dataShare.updateAuditTrailData(undefined);
    }
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  gettableview() {
    if (this.from_date != undefined) {
      this._spinner.open();
      this.dataSource.data = [];
      this._api_service
        .gettableview(
          this.country_code,
          this.customer_id,
          this.from_date,
          this.to_date,
          this.currentPage,
          this.pageSize
        )
        .subscribe((res) => {
          this.datasoucedata = res.data;
          let tableData: any[] = [];

          if (res) {
            for (let i = 0; i < this.datasoucedata.length; i++) {
              let datass = this.datasoucedata[i];
              let datas = {
                start_time: datass.fromdate,
                end_time: datass.todate,
                duration: datass.duration,
                getster_id: datass.screenid,
              };

              tableData.push(datas);
            }
            this.dataSource.data = tableData;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = res.data[0]?.countt;
            }, 0);
            this._spinner.close();
          }
        });
    }
  }
  datasoucedata: any;
  getdata() {
    this._spinner.open();
    this.dataSource.data = [];
    this._api_service
      .gettableview(
        this.country_code,
        this.customer_id,
        this.from_date,
        this.to_date,
        this.currentPage,
        this.pageSize
      )
      .subscribe((res) => {
        this.datasoucedata = res.data;
        let tableData: any[] = [];

        if (res) {
          for (let i = 0; i < this.datasoucedata.length; i++) {
            let datass = this.datasoucedata[i];
            let datas = {
              start_time: datass.fromdate,
              end_time: datass.todate,
              duration: datass.duration,
              getster_id: datass.screenid,
            };

            tableData.push(datas);
          }
          this.dataSource.data = tableData;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = res.data[0]?.countt;
          }, 0);
          this._spinner.close();
        }
      });
  }
  selectedDate!: any;
  formattedDate: any;
  _format_date: any;
  isDisabled_save_: boolean = true;
  showtimers: boolean = false;

  onDateChange(event: any) {
    this.formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
  }
  //* --------------------------  Public methods  --------------------------*//

  onDateSelected(event: any) {
    const selectedDate = event.value;
    const formattedDate = formatDate(selectedDate, 'yyyy-MM-dd', 'en'); // Format the date
    this.from_date = formattedDate;

    console.log(this.from_date, 'from');

    if (this.to_date != undefined) {
      this._spinner.open();
      this.dataSource.data = [];
      this._api_service
        .gettableview(
          this.country_code,
          this.customer_id,
          this.from_date,
          this.to_date,
          this.currentPage,
          this.pageSize
        )
        .subscribe((res) => {
          this.datasoucedata = res.data;
          let tableData: any[] = [];

          if (res) {
            for (let i = 0; i < this.datasoucedata.length; i++) {
              let datass = this.datasoucedata[i];
              let datas = {
                start_time: datass.fromdate,
                end_time: datass.todate,
                duration: datass.duration,
                getster_id: datass.screenid,
              };

              tableData.push(datas);
            }
            this.dataSource.data = tableData;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = res.data[0]?.countt;
            }, 0);
            this._spinner.close();
          }
        });
    }
  }
  onDateSelectedto(event: any) {
    const selectedDate = event.value;
    const formattedDate = formatDate(selectedDate, 'yyyy-MM-dd', 'en'); // Format the date
    this.to_date = formattedDate;
    console.log(this.to_date, 'to');
    if (this.to_date != undefined) {
      this._spinner.open();
      this.dataSource.data = [];
      this._api_service
        .gettableview(
          this.country_code,
          this.customer_id,
          this.from_date,
          this.to_date,
          this.currentPage,
          this.pageSize
        )
        .subscribe((res) => {
          this.datasoucedata = res.data;
          let tableData: any[] = [];

          if (res) {
            for (let i = 0; i < this.datasoucedata.length; i++) {
              let datass = this.datasoucedata[i];
              let datas = {
                start_time: datass.fromdate,
                end_time: datass.todate,
                duration: datass.duration,
                getster_id: datass.screenid,
              };

              tableData.push(datas);
            }
            this.dataSource.data = tableData;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = res.data[0]?.countt;
            }, 0);
            this._spinner.close();
          }
        });
    }
  }
  rowvalues: any;
  enable_edit(element: any) {
    this.btnDisabled = false;
    this.data = element;
    this.rowvalues = element;
  }
  // selectedFood: string = '0';
  // foods: Food[] = [
  //   { value: '0', viewValue: 'Calander View' },
  //   { value: '1', viewValue: 'Table View' },
  // ];
  filterValue = '';
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }

  displayedColumns: any = ['col1', 'col2', 'col3', 'col4'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;

  rowValue: any[] = [];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.translateMatPaginator(this.paginator);
  }
  onRowClicked(row: any) {}

  table_json_data: any;
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getdata();
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
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
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
        '.mat-table {' +
        '   width: 85%' +
        '}' +
        '.col6 {' +
        'visibility: none' +
        '}' +
        '.mat-radio-container {' +
        '   display: none' +
        '}' +
        '</style>' +
        `</head>

        <body onload="window.print()">
        <style>
          .mat-column-select{display:none}
          .matCellDef,th,td,img{
            height: 50px;
            width: 50px;
            padding-left:10px;

          }
             .mat-column-col5{
            display:none;
          }
          .mat-column-col6{
            display:none;
          }
          .mat-column-col7{
            display:none;
          }
          .mat-column-col8{
            display:none;
          }

          </style>

          <div style="width:100%;  display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">
          <img style="width:100px;height:100px" src="../../../../../assets/icons/getbiz_logo.png" alt="app-logo" />
          <div style=" display: flex;flex-direction: column; width:100%">
            <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">GETster.TECH PVT.LTD</span>
            <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">Schedule Meetings / Group Works / Events</span>
            <span style="text-align: center;font-size:14px;color:black;font-weight:600;">Records : ( ${currentPageStart} - ${currentPageEnd} of ${
          this.paginator.length
        } ) ${
          this.filterValue.length >= 1
            ? `(Filtered by -" ${this.filterValue} )`
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
  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}

export interface PeriodicElement {
  fromdate: string;
  todate: string;
  screenid: number;
  duration: string;
}
