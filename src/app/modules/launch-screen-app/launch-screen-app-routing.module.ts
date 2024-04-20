import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LaunchScreenAppComponent } from './launch-screen-app/launch-screen-app.component';
import { TimeShareForGetsterScreenComponent } from './Components/time-share-for-getster-screen/time-share-for-getster-screen.component';
import { GetsterScreenUsageDataComponent } from './Components/getster-screen-usage-data/getster-screen-usage-data.component';
import { ClaimRentPurchaseGetsterScreenComponent } from './Components/claim-rent-purchase-getster-screen/claim-rent-purchase-getster-screen.component';
import { AccessControlOfGetsterScreensComponent } from './Components/access-control-of-getster-screens/access-control-of-getster-screens.component';
import { ProvideProofOfDeliveryComponent } from './Components/provide-proof-of-delivery/provide-proof-of-delivery.component';
import { TableOnlyComponent } from './Components/time-share-for-getster-screen/table-only/table-only.component';

const routes: Routes = [
  { path: '', redirectTo: 'launch-screen', pathMatch: 'full' },
  {
    path: 'launch-screen',
    component: LaunchScreenAppComponent,
    children: [
      {
        path: '',
        redirectTo: 'time-share-for-getster-screen',
        pathMatch: 'full',
      },
      {
        path: 'time-share-for-getster-screen',
        component: TimeShareForGetsterScreenComponent,
      },
      {
        path: 'getster-screen-usage-data',
        component: GetsterScreenUsageDataComponent,
      },
      {
        path: 'claim-rent-purchase-getster-screen',
        component: ClaimRentPurchaseGetsterScreenComponent,
      },
      {
        path: 'access-control-of-getster-screens',
        component: AccessControlOfGetsterScreensComponent,
      },
      {
        path: 'provide-proof-of-delivery',
        component: ProvideProofOfDeliveryComponent,
      },
      // {
      //   path: 'table-only',
      //   component: TableOnlyComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaunchScreenAppRoutingModule {}
