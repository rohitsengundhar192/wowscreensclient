import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  constructor() {}

  private Audit_trail = new BehaviorSubject<any>(undefined);
  audit_trail_data = this.Audit_trail.asObservable();

  updateAuditTrailData(data: any) {
    this.Audit_trail.next(data);
  }

  private Assigned_category = new BehaviorSubject<any>(undefined);
  assigned_category_data = this.Assigned_category.asObservable();

  updateAssignedCategoryData(data: any) {
    this.Assigned_category.next(data);
  }

  private edit_datas = new BehaviorSubject<any>(undefined);
  edit_data = this.edit_datas.asObservable();

  Edit_Data(edit_data: any) {
    this.edit_datas.next(edit_data);
  }
  //DataShare for new Download Test component
  private download_test_user_id = new BehaviorSubject<any>(undefined);
  download_test_user_id_data = this.download_test_user_id.asObservable();

  downloadtestUserId(data: any) {
    this.download_test_user_id.next(data);
  }

  private disabled_data = new Subject<any>();
  disabled_data_data = this.disabled_data.asObservable();

  disabledData(data: any) {
    this.disabled_data.next(data);
  }

  private usage_datas = new BehaviorSubject<any>(undefined);
  usage_data = this.usage_datas.asObservable();

  UsageData(usage_data: any) {
    this.usage_datas.next(usage_data);
  }

  private share_wow_wallet_screen_id = new BehaviorSubject<any>(undefined);
  share_wow_wallet_screen_id_data =
    this.share_wow_wallet_screen_id.asObservable();

  shareWOWWalletScreenIdData(usage_data: any) {
    this.share_wow_wallet_screen_id.next(usage_data);
  }

  
  private share_wow_wallet_date_duration = new BehaviorSubject<any>(undefined);
  share_wow_wallet_date_duration_data =
    this.share_wow_wallet_date_duration.asObservable();

  shareWOWWalletDateDuration(usage_data: any) {
    this.share_wow_wallet_date_duration.next(usage_data);
  }

  private usage_datas_another = new BehaviorSubject<any>(undefined);
  usage_datas_another_data = this.usage_datas_another.asObservable();

  UsageDataAnother(usage_data: any) {
    this.usage_datas_another.next(usage_data);
  }

  private share_screen_inches = new BehaviorSubject<any>(undefined);
  share_screen_inches_data = this.share_screen_inches.asObservable();

  ShareScreenInches(usage_data: any) {
    this.share_screen_inches.next(usage_data);
  }

  //DataShare for QR code
  private qrcode_data_id = new BehaviorSubject<any>(undefined);
  qrcode_move_id_data = this.qrcode_data_id.asObservable();

  qrCodeMovedata(data: any) {
    this.qrcode_data_id.next(data);
  }

  //share getsterscreenid to rent two
  private getster_screen_two_id = new BehaviorSubject<any>(undefined);
  getster_screen_two_data = this.getster_screen_two_id.asObservable();

  getsterScreenIdDAta(data: any) {
    this.getster_screen_two_id.next(data);
  }

  //share screenid for issuereported
  private share_screen_id_for_issue_reported = new BehaviorSubject<any>(
    undefined
  );
  share_screen_id_for_issue_reported_data =
    this.share_screen_id_for_issue_reported.asObservable();

  ShareSCreenIdforIssueReported(data: any) {
    this.share_screen_id_for_issue_reported.next(data);
  }

  //DataShare for dialogue_close
  private dialogue_close_id = new BehaviorSubject<any>(undefined);
  dialogue_close_id_data = this.dialogue_close_id.asObservable();

  dialogueCloseData(data: any) {
    this.dialogue_close_id.next(data);
  }

  //data share for the claim rental wavier forms table to exchage
  private claim_rental_table_id = new BehaviorSubject<any>(undefined);
  claim_rental_table_id_data = this.claim_rental_table_id.asObservable();

  claimRentaltableData(data: any) {
    this.claim_rental_table_id.next(data);
  }

  //data share for get screen id to claim reantal wavier popup
  private claim_rental_screen_id = new BehaviorSubject<any>(undefined);
  claim_rental_screen_id_data = this.claim_rental_screen_id.asObservable();

  claimRentalScreenId(data: any) {
    this.claim_rental_screen_id.next(data);
  }

  //data share for get screen id to check rent screen id
  private claim_rent_screen_id = new BehaviorSubject<any>(undefined);
  claim_rent_screen_id_data = this.claim_rent_screen_id.asObservable();

  claimRentScreenId(data: any) {
    this.claim_rent_screen_id.next(data);
  }

  //data share for get screen id to check purchase screen id
  private claim_purchase_screen_id = new BehaviorSubject<any>(undefined);
  claim_purchase_screen_id_data = this.claim_purchase_screen_id.asObservable();

  claimPurchaseScreenId(data: any) {
    this.claim_purchase_screen_id.next(data);
  }

  //data share for get screen id to check claim screen id
  private claim_claim_screen_id = new BehaviorSubject<any>(undefined);
  claim_claim_screen_id_data = this.claim_claim_screen_id.asObservable();

  claimClaimScreenId(data: any) {
    this.claim_claim_screen_id.next(data);
  }

  //data share for share wow amount from normal to santhosan app
  private share_wow_wmount_id = new BehaviorSubject<any>(undefined);
  share_wow_wmount_id_data = this.share_wow_wmount_id.asObservable();

  shareWowAmountId(data: any) {
    this.share_wow_wmount_id.next(data);
  }

  //data share for share wow amount to normal from santhosan app
  private share_wow_wmount_get_id = new BehaviorSubject<any>(undefined);
  share_wow_wmount_get_id_data = this.share_wow_wmount_get_id.asObservable();

  shareWowAmountgetId(data: any) {
    this.share_wow_wmount_get_id.next(data);
  }

  //data share for share report status to disable the clain rental button
  private share_report_status = new BehaviorSubject<any>(undefined);
  share_report_status_data = this.share_report_status.asObservable();

  ShareReportStatus(data: any) {
    this.share_report_status.next(data);
  }

  //data share for share report status to disable the clain rental button
  private claimbtn_disable = new BehaviorSubject<any>(undefined);
  claimbtn_disable_data = this.claimbtn_disable.asObservable();

  ClaimBtnDisable(data: any) {
    this.claimbtn_disable.next(data);
  }

  //data share for re,oad the cliam base table after passclaim rental wavier postt
  private reload_claim_rent_purchase_Table = new BehaviorSubject<any>(
    undefined
  );
  reload_claim_rent_purchase_Table_data =
    this.reload_claim_rent_purchase_Table.asObservable();

  ClaimRentPurchaseTable(data: any) {
    this.reload_claim_rent_purchase_Table.next(data);
  }

  private reload_claim_rent_purchase_Table_check = new BehaviorSubject<any>(
    undefined
  );
  reload_claim_rent_purchase_Table_check_data =
    this.reload_claim_rent_purchase_Table_check.asObservable();

  ClaimRentPurchaseTableCheck(data: any) {
    this.reload_claim_rent_purchase_Table_check.next(data);
  }
  //new

  private layout = new BehaviorSubject<any>(false);
  layout_data = this.layout.asObservable();

  secondary(data: any) {
    this.layout.next(data);
  }
}
