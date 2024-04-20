import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatRadioButton } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';

import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { CustomSpinnerService } from 'src/app/shared/services/custom-spinner/custom-spinner.service';
import { TokenService } from 'src/app/shared/services/api/token.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-testing-timeshare',
  templateUrl: './testing-timeshare.component.html',
  styleUrls: ['./testing-timeshare.component.scss'],
})
export class TestingTimeshareComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  @ViewChild('radio') radio!: MatRadioButton;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//

  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    private _headerTitle: HeaderTitleService,
    private _apiService: ApiService,
    private _dataSnack: SnackBarService,
    private _spinner: CustomSpinnerService,
    private _tokenService: TokenService,
    private dialog: MatDialog
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {}

  //* ----------------------------  APIs Methods  --------------------------*//
  loadData() {}
  //* --------------------------  Public methods  --------------------------*//

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
    // console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
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
  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
