import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaunchScreenAppRoutingModule } from './launch-screen-app-routing.module';
import { LaunchScreenAppComponent } from './launch-screen-app/launch-screen-app.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimeShareForGetsterScreenComponent } from './Components/time-share-for-getster-screen/time-share-for-getster-screen.component';
import { NewBookScreenComponent } from './Components/time-share-for-getster-screen/new-book-screen/new-book-screen.component';
import { EditBookScreenComponent } from './Components/time-share-for-getster-screen/edit-book-screen/edit-book-screen.component';
import { GanttWrapperComponent } from './Components/time-share-for-getster-screen/gantt-wrapper/gantt-wrapper.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { GetsterScreenUsageDataComponent } from './Components/getster-screen-usage-data/getster-screen-usage-data.component';
import { UsageDataTableComponent } from './Components/getster-screen-usage-data/usage-data-table/usage-data-table.component';
import { ClaimRentPurchaseGetsterScreenComponent } from './Components/claim-rent-purchase-getster-screen/claim-rent-purchase-getster-screen.component';
import { RentalWavierDetailsComponent } from './Components/claim-rent-purchase-getster-screen/rental-wavier-details/rental-wavier-details.component';
import { RentalDetailsComponent } from './Components/claim-rent-purchase-getster-screen/rental-details/rental-details.component';
import { SellingDetailsComponent } from './Components/claim-rent-purchase-getster-screen/selling-details/selling-details.component';
// import { ClaimRentalWavierOneComponent } from './Components/claim-rent-purchase-getster-screen/popups/Claim Rental Wavier/claim-rental-wavier-one/claim-rental-wavier-one.component';
// import { ClaimRentalWavierThreeComponent } from './Components/claim-rent-purchase-getster-screen/popups/Claim Rental Wavier/claim-rental-wavier-three/claim-rental-wavier-three.component';
// import { ClaimRentalWavierTwoComponent } from './Components/claim-rent-purchase-getster-screen/popups/Claim Rental Wavier/claim-rental-wavier-two/claim-rental-wavier-two.component';
import { PurchaseOneComponent } from './Components/claim-rent-purchase-getster-screen/popups/Purchase/purchase-one/purchase-one.component';
import { PurchaseTwoComponent } from './Components/claim-rent-purchase-getster-screen/popups/Purchase/purchase-two/purchase-two.component';
import { RentOneComponent } from './Components/claim-rent-purchase-getster-screen/popups/Rent/rent-one/rent-one.component';
import { RentTwoComponent } from './Components/claim-rent-purchase-getster-screen/popups/Rent/rent-two/rent-two.component';
// import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode/lib/ngx-scanner-qrcode.module';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { CKEditorModule } from 'ng2-ckeditor';
import { ReportissueComponent } from './Components/claim-rent-purchase-getster-screen/popups/reportissue/reportissue.component';
import { AccessControlOfGetsterScreensComponent } from './Components/access-control-of-getster-screens/access-control-of-getster-screens.component';
import { BuyNewScreensComponent } from './Components/claim-rent-purchase-getster-screen/popups/buy-new-screens/buy-new-screens.component';
import { ProvideProofOfDeliveryComponent } from './Components/provide-proof-of-delivery/provide-proof-of-delivery.component';
import { ProvideProofOfDeliveryTwoComponent } from './Components/provide-proof-of-delivery/provide-proof-of-delivery-two/provide-proof-of-delivery-two.component';
import { AuditTrailTableComponent } from './Components/audit-trail-table/audit-trail-table.component';
import { AuditTrailDialogueComponent } from 'src/app/shared/dialogs/audit-trail-dialogue/audit-trail-dialogue.component';
import { ShowTableComponent } from './Components/time-share-for-getster-screen/show-table/show-table.component';
import { OpenAnotherAppComponent } from './Components/getster-screen-usage-data/open-another-app/open-another-app.component';
import { TableOnlyComponent } from './Components/time-share-for-getster-screen/table-only/table-only.component';
import { ViewReportComponent } from './Components/claim-rent-purchase-getster-screen/popups/view-report/view-report.component';
import { TestingTimeshareComponent } from './Components/time-share-for-getster-screen/testing-timeshare/testing-timeshare.component';
import { ClaimRentalWavierOneComponent } from './Components/claim-rent-purchase-getster-screen/popups/Claim Rental Wavier/claim-rental-wavier-one/claim-rental-wavier-one.component';
import { ClaimRentalWavierTwoComponent } from './Components/claim-rent-purchase-getster-screen/popups/Claim Rental Wavier/claim-rental-wavier-two/claim-rental-wavier-two.component';
import { ClaimRentalWavierThreeComponent } from './Components/claim-rent-purchase-getster-screen/popups/Claim Rental Wavier/claim-rental-wavier-three/claim-rental-wavier-three.component';
import { ClaimRentalWavierNotRegComponent } from './Components/claim-rent-purchase-getster-screen/popups/Claim Rental Wavier/claim-rental-wavier-not-reg/claim-rental-wavier-not-reg.component';
// import { ClaimRentalWavierNotRegComponent } from './Components/claim-rent-purchase-getster-screen/popups/Claim Rental Wavier/claim-rental-wavier-not-reg/claim-rental-wavier-not-reg.component';
@NgModule({
  declarations: [
    LaunchScreenAppComponent,
    TimeShareForGetsterScreenComponent,
    NewBookScreenComponent,
    EditBookScreenComponent,
    GanttWrapperComponent,
    GetsterScreenUsageDataComponent,
    UsageDataTableComponent,
    ClaimRentPurchaseGetsterScreenComponent,
    RentalWavierDetailsComponent,
    RentalDetailsComponent,
    SellingDetailsComponent,
    // ClaimRentalWavierOneComponent,
    // ClaimRentalWavierTwoComponent,
    // ClaimRentalWavierThreeComponent,
    RentOneComponent,
    RentTwoComponent,
    PurchaseOneComponent,
    PurchaseTwoComponent,
    ReportissueComponent,
    AccessControlOfGetsterScreensComponent,
    BuyNewScreensComponent,
    ProvideProofOfDeliveryComponent,
    ProvideProofOfDeliveryTwoComponent,
    AuditTrailTableComponent,
    AuditTrailDialogueComponent,
    ShowTableComponent,
    OpenAnotherAppComponent,
    TableOnlyComponent,
    ViewReportComponent,
    TestingTimeshareComponent,
    ClaimRentalWavierOneComponent,
    ClaimRentalWavierTwoComponent,
    ClaimRentalWavierThreeComponent,
    ClaimRentalWavierNotRegComponent,
    // ClaimRentalWavierNotRegComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LaunchScreenAppRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    CKEditorModule,
    NgxScannerQrcodeModule,
  ],
})
export class LaunchScreenAppModule {}
