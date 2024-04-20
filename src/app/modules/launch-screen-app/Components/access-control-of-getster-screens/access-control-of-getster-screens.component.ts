import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
// import { AccessControlLoginComponent } from './../access-control-login/access-control-login.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { TreeData } from 'src/app/models/tree.interface';
import { of } from 'rxjs';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { JwtauthserviceService } from 'src/app/shared/services/api/jwtauthservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { LoginComponent } from 'src/app/shared/dialogs/login/login.component';

@Component({
  selector: 'app-access-control-of-getster-screens',
  templateUrl: './access-control-of-getster-screens.component.html',
  styleUrls: ['./access-control-of-getster-screens.component.scss'],
})
export class AccessControlOfGetsterScreensComponent implements OnInit {
  //* ------------------------------  START  ------------------------------ *//

  //* ------------------------------  Variable Declaration  ------------------------------ *//

  hidecontent: boolean = false;
  selectform!: UntypedFormGroup;

  country_code: any;
  customer_id: any;
  user_login_id: any;

  checkbox: any;

  values: any[] = [];

  data: any;

  btnDisabled = false;
  user_id_login: any;
  dialogOpen: boolean = false;
  nestedTreeControl!: NestedTreeControl<TreeData>;
  nestedDataSource!: MatTreeNestedDataSource<TreeData>;
  checklistSelection = new SelectionModel<TreeData>(true /* multiple */);
  selected_category_val: any = [];
  user_registration_login_approval_status: any = 3;
  makeloop: any[] = [];
  makeother: any[] = [];
  nesteddata: any[] = [];
  all_data: any;
  get_data: any;
  //* ------------------------------  Constructor  ------------------------------ *//

  constructor(
    public dialog: MatDialog,
    private change: ChangeDetectorRef,
    private _headerTitle: HeaderTitleService,
    private table: ApiService,
    private formbuilder: UntypedFormBuilder,
    private _dataSharingService: DataSharingService,
    private authService: JwtauthserviceService,
    private _snackbar: SnackBarService,
    private _headertitle: HeaderTitleService,
    private _cdf: ChangeDetectorRef
  ) {
    this.selectform = this.formbuilder.group({
      selectvalue: [''],
    });
    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }
  user_category_id: any;
  //* ------------------------------  Lifecycle Hooks  ------------------------------ *//
  arr: any[] = [];
  ngOnInit(): void {
    this._headertitle.setTitle(`Access control of GETster Screens`);
    this._dataSharingService.updateAuditTrailData(1);
    let one: any = localStorage.getItem('access_token');
    let token: any = this.authService.decodeJwtToken(one);
    console.log(token, 'token');

    this.country_code = token.user.country_code;
    this.customer_id = token.user.customer_id;
    this.user_id_login = token.user.user_id;

    // this.user_registration_login_approval_status =
    //   token.user.user_registration_login_approval_status;

    if (this.user_registration_login_approval_status === 3) {
      this.hidecontent = false; // Show the HTML content
    } else {
      this.hidecontent = true; // Hide the HTML content

      const dialogRef = this.dialog.open(LoginComponent, {
        disableClose: true,
        height: 'auto',
        width: '350px',
        minWidth: '350px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.hidecontent = this.user_registration_login_approval_status !== 3;
      });
    }

    this._headerTitle.setTitle('Access control of WOW Screens');

    this.table
      .get_category(this.country_code, this.customer_id)
      .subscribe((res) => {
        if (res.data?.length == 0) {
          this._snackbar.success('Data Not Found', 'OK');
        }
        this.nestedDataSource.data = res.data;
        this.nestedTreeControl.dataNodes = res.data;
        this.nesteddata = this.nestedDataSource.data;
      });

    this.userCategory();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.userCategory();
  }

  userCategory() {
    this.table
      .get_category_access(this.country_code, this.customer_id)
      .subscribe((res) => {
        this.makeloop = res.data;
        this.arr = [];
        this.makeloop.map(async (res) => {
          this.get_data = res.permitted_by_user_category_id;
          this.arr.push(this.get_data);
          if (this.arr != undefined) {
            let a: any[] = [];
            a.push(this.nesteddata);
            while (a.length > 0) {
              let b: any[] = [];
              for (let i = 0; i < a.length; i++) {
                for (let j = 0; j < a[i].length; j++) {
                  for (let k = 0; k < this.arr.length; k++) {
                    if (a[i][j].user_category_id == this.arr[k]) {
                      this.checklistSelection.select(a[i][j]);
                      this.nestedTreeControl.collapseAll();
                    }
                  }
                  b.push(a[i][j].children);
                }
              }
              a = b;
            }
          }
        });
        this._cdf.detectChanges();
      });
  }
  ngOnDestroy() {
    if (this._dataSharingService.updateAuditTrailData) {
      this._dataSharingService.updateAuditTrailData(undefined);
    }
  }

  expand() {
    this.nestedTreeControl.expandAll();
  }
  collapse() {
    this.nestedTreeControl.collapseAll();
  }
  //* ------------------------------  APIs Methods  ------------------------------ *//

  updateusercategoryid() {
    this.changesMade = false;
    let payload: any = {
      user_category: this.selected_category_val,
      login_id: this.user_id_login,
    };
    let details: any = {
      user_id: this.user_id_login,
      entry_type: 'Insert',
    };

    this.table
      .postusercategoryid(this.country_code, this.customer_id, payload)
      .subscribe({
        next: (res) => {
          if (res.data?.length == 0) {
            this._snackbar.success('Data Not Found', 'OK');
          }
          if (res.statusCode == 200) {
            this._snackbar.success(res.message, 'OK');
            this.table
              .get_category_access(this.country_code, this.customer_id)
              .subscribe((res) => {
                this.makeloop = res.data;
                this.arr = [];
                this.makeloop.map(async (res) => {
                  this.get_data = res.permitted_by_user_category_id;
                  this.arr.push(this.get_data);
                  if (this.arr != undefined) {
                    let a: any[] = [];
                    a.push(this.nesteddata);
                    while (a.length > 0) {
                      let b: any[] = [];
                      for (let i = 0; i < a.length; i++) {
                        for (let j = 0; j < a[i].length; j++) {
                          for (let k = 0; k < this.arr.length; k++) {
                            if (a[i][j].user_category_id == this.arr[k]) {
                              this.checklistSelection.select(a[i][j]);
                              this.nestedTreeControl.collapseAll();
                            }
                          }
                          b.push(a[i][j].children);
                        }
                      }
                      a = b;
                    }
                  }
                });
              });
          } else {
            this._snackbar.error(res.message, 'OK');
          }
          this.checklistSelection.clear(true);
          this.selected_category_val = undefined;
        },
      });

    this.table
      .postaudittrail(this.country_code, this.customer_id, details)
      .subscribe({
        next: (_res) => {},
      });
  }
  selection = new SelectionModel<any>(true, []);
  //* ------------------------------  Helper Function  ------------------------------ *//
  changesMade: boolean = false;

  private _getChildren = (node: TreeData) => of(node.children);

  hasNestedChild = (_: string, nodeData: TreeData) =>
    nodeData.children.length > 0;

  refreshTreeData() {
    const data = this.nestedDataSource.data;
    this.nestedDataSource.data = [];
    this.nestedDataSource.data = data;
  }

  getLevel = (node: TreeData): any => node.level;

  isExpandable = (node: TreeData) => node.expandable;

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TreeData): any {
    const descendants = this.nestedTreeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) => {
      child;
    });
    return descendants.map((val) => {
      let temp: any = val.ishidden;
      let a: any[] = temp;
      return a;
    });
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TreeData): boolean {
    const descendants = this.nestedTreeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TreeData): void {
    this.checklistSelection.toggle(node);
    const descendants = this.nestedTreeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    // Force update for the parent
    descendants.forEach((child) => {
      this.checklistSelection.isSelected(child);
    });
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TreeData): void {
    this.changesMade = true;
    this.checklistSelection.toggle(node);
    this.selected_category_val = this.checklistSelection.selected;
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TreeData): void {
    let parent: TreeData | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TreeData): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.nestedTreeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TreeData): TreeData | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.nestedTreeControl?.dataNodes?.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.nestedTreeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}

//* ------------------------------  END  ------------------------------ *//
