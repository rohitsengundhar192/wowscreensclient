import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import * as XLSX from 'xlsx';
import { MatDialogRef } from '@angular/material/dialog';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-claim-rental-wavier-three',
  templateUrl: './claim-rental-wavier-three.component.html',
  styleUrls: ['./claim-rental-wavier-three.component.scss'],
})
export class ClaimRentalWavierThreeComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //* -----------------------  Variable Declaration  -----------------------*//
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  filterValue = '';
  displayedColumns: string[] = ['col1', 'col2', 'col3', 'col4'];
  rowValue: any[] = [];
  country_code: any;
  customer_id: any;
  user_id_login: any;
  getster_screen_id: any;
  rental_waiver_claim_duration_in_months: any;
  claimed_for_collection_qty: any;
  claimed_for_collection: any;
  screen_inch: any;
  formatdate: any;
  alreadydate: any;
  floor = Math.floor;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(
    public loginDialogRef: MatDialogRef<ClaimRentalWavierThreeComponent>,
    private _dataShare: DataSharingService,
    private _apiservice: ApiService,
    private authService: JwtauthserviceService,
    private _datashare: DataSharingService,
    private _snackbar: SnackBarService
  ) {}

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;
    this._dataShare.claim_rental_table_id_data.subscribe((res) => {
      console.log(res, 'ress');

      if (res?.total_weight_yet_to_be_collect != undefined) {
        this.dataSource.data = [res];

        this.claimed_for_collection = res.total_weight_yet_to_be_collect;
        this.rental_waiver_claim_duration_in_months = Math.floor(res.total_weight_yet_to_be_collect / 1000);

        console.log('====================================');
        console.log(this.rental_waiver_claim_duration_in_months);
        console.log('====================================');
        

        this.claimed_for_collection_qty =
          1000 * this.rental_waiver_claim_duration_in_months;
        console.log(
          this.claimed_for_collection_qty,
          'claimed_for_collection_qty'
        );
      }
    });

    this._datashare.getster_screen_two_data.subscribe((res) => {
      this.getster_screen_id = res;
    });

    if (this.getster_screen_id != undefined) {
      this._apiservice
        .getscreenincheuasgedate(this.getster_screen_id)
        .subscribe((res) => {
          console.log(res.data, 'ress');
          this.screen_inch = res.data[0].screen_size_in_inch;

          //Already datetime
          this.alreadydate =
            res.data[0].purchase_rental_valid_until_utc_datetime;

          //Current Datetime
          let currentDatetime: Date = new Date();
          let c = formatDate(currentDatetime, 'yyyy-MM-dd HH:mm:ss', 'en');
          if (this.alreadydate >= c) {
            console.log('work with future on that datetime');
            // // Get the already date
            const currentDate = new Date(this.alreadydate);
            console.log(this.rental_waiver_claim_duration_in_months, 'curre');

            // Add the specified number of months to the current date
            currentDate.setMonth(
              currentDate.getMonth() +
                this.rental_waiver_claim_duration_in_months
            );

            // Define an array of month names
            const monthNames: string[] = [
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

            // Format the date as "dd Mon yyyy" (e.g., "28 Oct 2023")
            const formattedDate: string = `${currentDate.getDate()} ${
              monthNames[currentDate.getMonth()]
            } ${currentDate.getFullYear()}`;

            // Print the formatted date
            console.log(formattedDate);
            this.formatdate = formattedDate;
          } else {
            console.log('work with today on that datetime');
            // Get the current date
            const currentDate = new Date();
            console.log(currentDate, 'curre');

            // Add the specified number of months to the current date
            currentDate.setMonth(
              currentDate.getMonth() +
                this.rental_waiver_claim_duration_in_months
            );

            // Define an array of month names
            const monthNames: string[] = [
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

            // Format the date as "dd Mon yyyy" (e.g., "28 Oct 2023")
            const formattedDate: string = `${currentDate.getDate()} ${
              monthNames[currentDate.getMonth()]
            } ${currentDate.getFullYear()}`;

            // Print the formatted date
            console.log(formattedDate);
            this.formatdate = formattedDate;
          }
        });
    }
  }
  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  postclaimrent() {
    let body: any = {
      claimed_for_collection_qty: this.claimed_for_collection_qty,
      rental_waiver_claim_duration_in_months:
        this.rental_waiver_claim_duration_in_months,
      login_id: this.user_id_login,
    };
    this._apiservice
      .postclaimrental(
        this.country_code,
        this.customer_id,
        this.getster_screen_id,
        body
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this._snackbar.success(res.message, 'OK');
          this.onNoClick();
          this._dataShare.ClaimRentPurchaseTableCheck(21);
          this._dataShare.ClaimRentPurchaseTable(22);
        } else {
          this._snackbar.error(res.message, 'OK');
        }
      });
  }
  //* --------------------------  Public methods  --------------------------*//
  onNoClick(): void {
    this.loginDialogRef.close();
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
  public downloadAsPDF() {
    let pageIndex: number = Number(this.paginator.pageIndex);
    let pageSize: number = Number(this.paginator.pageSize);

    let currentPageEnd = pageSize * (pageIndex + 1);
    let currentPageStart = currentPageEnd - (pageSize - 1);

    // let jwt_token = localStorage.getItem('access_token');
    // let token1 = this._tokenService.decodeJwtToken(jwt_token);
    // let app_name: string = token1.user.registered_educational_institution_name;
    // let districtStatePincode: string = `${token1.user.city_district_county} ${token1.user.state_province} ${token1.user.pin_code};`;
    // let addressline1_adressline2: string = ` ${token1.user.address_line_1} ${token1.user.address_line_2};`;

    // let customer_logo = ` ${environment.ceph_URL}/${token1.user.country_code}-${token1.user.customer_id}/${token1.user.customer_sub_domain_name}-icon-128x128.png;`;

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
        '.mat-column-col2 {' +
        'width:10%' +
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


        </style>

        <div style="width:100%;  display: flex;flex-direction: row;align-items:center; margin-bottom:5px;margin-top:10px">

        <ng-container *ngIf="!customer_logo">
          <img
            src="../../../../../assets/images/image 25.png"

            style="width:60px;height:54px border-radius: 10px"

          />
        </ng-container>

        <div style=" display: flex;flex-direction: column; width:100%">
          <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;">GETster.TECH PVT.LTD</span>
          <span style="text-align: center;font-size:16px;color:blue;text-size:16px;font-weight:600;text-decoration-line: underline;"></span>
          <span style="text-align: center;font-size:16px;color:black;font-weight:600;text-transform: uppercase">GETster Screen Default Images / Videos</span>
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
        <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500"> </span>
        <span style="text-align: end;font-size:12px;text-size:12px;font-weight:500"></span>
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
}
