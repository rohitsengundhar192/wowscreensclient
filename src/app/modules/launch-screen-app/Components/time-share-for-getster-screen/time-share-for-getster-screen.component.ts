
import { Component, OnInit } from '@angular/core';
import { NewBookScreenComponent } from './new-book-screen/new-book-screen.component';
import { EditBookScreenComponent } from './edit-book-screen/edit-book-screen.component';
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
interface Food {
  value: string;
  viewValue: string;
}
export interface PeriodicElement {
  fromdate: string;
  todate: string;
  screenid: number;
  duration: string;
}
@Component({
  selector: 'app-time-share-for-getster-screen',
  templateUrl: './time-share-for-getster-screen.component.html',
  styleUrls: ['./time-share-for-getster-screen.component.scss'],
})
export class TimeShareForGetsterScreenComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  firstFormGroup3 = new FormGroup({
    date1: new FormControl(),
    date2: new FormControl(),
    selectdate: new FormControl('', Validators.required),
  });
  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginatorElement', { read: ElementRef })
  paginatorHtmlElement!: ElementRef;

  displayedColumns: string[] = ['fromdate', 'todate', 'screenid', 'duration'];
  //* -----------------------  Variable Declaration  -----------------------*//
  country_code: any;
  customer_id: any;
  user_id_login: any;

  tableform!: UntypedFormGroup;

  from_date: any;
  to_date: any;

  startdate: any;
  enddate: any;

  data: any;

  btnDisabled = true;
  table_view: boolean = true;

  ELEMENT_DATA: PeriodicElement[] = [];

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  dataSource: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  filterValue = '';
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
    private _spinner: CustomSpinnerService
  ) {
    this.tableform = this.formbuilder.group({
      date1: [''],
      date2: [''],
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    this._header.setTitle(`Time Share for GETster Screens`);
    this._dataShare.updateAuditTrailData(3);
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    this.getgantchartdata();
  }
  ngOnDestroy() {
    if (this._dataShare.updateAuditTrailData) {
      this._dataShare.updateAuditTrailData(undefined);
    }
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  gettableview() {
    if (this.from_date != undefined) {
      this._api_service
        .gettableviewnormal(
          this.country_code,
          this.customer_id,
          this.from_date,
          this.to_date
        )
        .subscribe({
          next: (res: any) => {
            console.log('time share data');
            if (res.data?.length == 0) {
              this._snackbar.success('Data Not Found', 'OK');
            }
            // if (res.data?.table_view?.length == 0) {
            //   this._snackbar.success('Database and Table Not Found', 'OK');
            // }
            this.dataSource.data = res.data;
          },
        });
    }
  }
  selectedDate!: any;
  formattedDate: any;
  _format_date: any;
  selectedDateto!: any;
  formattedDateto: any;
  _format_dateto: any;
  isDisabled_save_: boolean = true;
  showtimers: boolean = false;

  onDateChange(event: any) {
    this.formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
  }
  //* --------------------------  Public methods  --------------------------*//
  editscreenpopup() {
    const dialogref = this.dialog.open(EditBookScreenComponent, {
      disableClose: true,
      width: '700px',
      height: '600px',
      data: this.data,
    });

    this.data_share.Edit_Data(this.data);

    dialogref.afterClosed().subscribe((_res) => {
      this.btnDisabled = true;
      this.gettableview();
    });
  }
  onDateSelected(event: any) {
    const selectedDate = event.value;
    const formattedDate = formatDate(selectedDate, 'yyyy-MM-dd', 'en'); // Format the date
    this.from_date = formattedDate;

    if (this.to_date != undefined) {
      this.gettableview();
    }
  }
  onDateSelectedto(event: any) {
    const selectedDate = event.value;
    const formattedDate = formatDate(selectedDate, 'yyyy-MM-dd', 'en'); // Format the date
    this.to_date = formattedDate;
    this.gettableview();
  }
  rowvalues: any;
  enable_edit(element: any) {
    this.btnDisabled = false;
    this.data = element;
    this.rowvalues = element;
  }
  selectedFood: string = '1';
  foods: Food[] = [
    { value: '1', viewValue: 'Table View' },
    // { value: '0', viewValue: 'Calander View' },
  ];

  onFoodSelectionChange() {
    if (this.selectedFood === '0') {
      // Call your function here
      console.log('works');
      this.getgantchartdata();
    }
  }

  myFunction() {
    // Your function logic here
  }
  //* ------------------------------ Helper Function -----------------------*//
  openbookscreen(): void {
    const dialogRef = this.dialog.open(NewBookScreenComponent, {
      disableClose: true,
      height: '90%',
      width: '560px',
      minWidth: '250px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.data) {
        this.getgantchartdata();
        this.gettableview();
      }
    });
  }

  openeditbookscreen(): void {
    const dialogRef = this.dialog.open(EditBookScreenComponent, {
      disableClose: true,
      height: '600px',
      width: '560px',
      minWidth: '250px',
      data: this.data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.btnDisabled = true;
      if (result?.data) {
        this.gettableview();
        this.getgantchartdata();
        this.btnDisabled = true;
      }
    });
  }
  //! -------------------------------  End  --------------------------------!//

  task: any;
  ta: any[] = [];
  done: any;
  tasks: any[] = [];

  getgantchartdata() {
    this.task = [];
    this.ta = [];
    this._spinner.open();
  
    this._api_service
    .getganttchart(this.country_code, this.customer_id)
    .subscribe((res) => {
      this.task = res.data;
      console.log(this.task, 'task');

      if (this.task.length != undefined) {
        let task_data: any[] = [];

        for (let i = 0; i < this.task.length; i++) {
          // for (let j = 0; j < this.task[i].length; j++) {
            let element = this.task[i];
            let d = {
              auto_id: element.booking_id,
              start: element.fromdate,
              end: element.todate,
              id: i * this.task[i].length + i,
              name: element.screenid,
              type: 'task',
              duration: element.duration,
              progress: 100,
              first_name: element.first_name,
              last_name: element.last_name,
              dependencies: [],
              screen_size_in_inch: element.screen_size_in_inch,
            };
            task_data.push(d);
          // }
        }

        this.tasks = task_data;
        console.log(this.tasks,'taks');
        
      }
      this._spinner.close();
      if (this.task.length == 0) {
        this._snackbar.success('Data Not Found', 'OK');
        this._spinner.close();
      }
    });

    // this._api_service.getganttchart(this.country_code, this.customer_id).subscribe((res) => {
    //   this.task = res.data;
    //   console.log(this.task, 'task');
    
    //   if (this.task.length !== undefined) {
    //     let task_data: any[] = [];
    //     const groupedData: { [key: number]: any[] } = {};
    
    //     // Group data by screenid
    //     this.task.forEach((element: { screenid: any; booking_id: any; fromdate: any; todate: any; duration: any; first_name: any; last_name: any; screen_size_in_inch: any; }, i: number) => {
    //       const screenid = element.screenid;
    
    //       // If the array for the current screenid doesn't exist, create one
    //       groupedData[screenid] = groupedData[screenid] || [];
    
    //       // Push the values to the corresponding array
    //       groupedData[screenid].push({
    //         auto_id: element.booking_id,
    //         start: element.fromdate,
    //         end: element.todate,
    //         id: i * this.task.length + i,
    //         name: element.screenid,
    //         type: 'task',
    //         duration: element.duration,
    //         progress: 100,
    //         first_name: element.first_name,
    //         last_name: element.last_name,
    //         dependencies: [],
    //         screen_size_in_inch: element.screen_size_in_inch,
    //       });
    //     });
    
    //     // Convert the grouped data into an array of objects
    //     Object.keys(groupedData).forEach(screenid => {
    //       const screenObjects = groupedData[screenid as unknown as number];
    //       task_data = task_data.concat(screenObjects);
    //     });
    
    //     this.tasks = task_data;
    //     console.log(this.tasks, 'tasks');
    
    //   }
    
    //   this._spinner.close();
    
    //   if (this.task.length == 0) {
    //     this._snackbar.success('Data Not Found', 'OK');
    //     this._spinner.close();
    //   }
    // });
    
    
  }
}

