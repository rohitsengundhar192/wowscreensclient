// const manageGetsterScreen = 'https://g15api.getster.tech/api/';
// const baseURL= 'https://u25api.getwow.education/api/';
// const baseURL = 'http://localhost:3000/api/';
const baseURL = 'https://u25api.getwow.community/api/'
export const environment = {
  production: true,
  baseURL: '',

  baseURL_Live: 'https://apitemplate.getbiz.app',

  // wow_wallet_pop_up: "https://p28.getwow.community",
  // get_wallet_pop_up: "https://p27.getwow.community",

  // wow_wallet_pop_up: 'https://p28.getwow.education',
  // get_wallet_pop_up: 'https://p27.getwow.education',
  payment_options_india:'https://p50.getwow.community',
  // payment_options_india:'https://p50.getwow.education',

  postbookscreen: baseURL + 'wow-screens-management/time-share/book-screen',
  getavailablescreens:
    baseURL + 'wow-screens-management/time-share/available-screens',
  getavailablescreensedit:
    baseURL + 'wow-screens-management/time-share/available-screens-edit',
  gettableview: baseURL + 'wow-screens-management/time-share/table-viewd',
  gettableviewnormal: baseURL + 'wow-screens-management/time-share/table-view',
  updatescreen: baseURL + 'wow-screens-management/time-share/update-screen',
  getscreenregister:
    baseURL + 'wow-screens-management/usage-details/screens-registration',
  getusagedata:
    baseURL + 'wow-screens-management/usage-details/screen-usage-data',
  getscreenregisterclaim:
    baseURL +
    'wow-screens-management/screen-usage-details/screens-registration-claim',
  getqrcodedata:
    baseURL + 'wow-screens-management/screen-usage-details/qr-code-data',
  postpaywowrent:
    baseURL + 'wow-screens-management/screen-usage-details/post-pay-wow-rent',
  postpaywowpurchase:
    baseURL +
    'wow-screens-management/screen-usage-details/post-pay-wow-purchase',
  putreportissue:
    baseURL + 'wow-screens-management/screen-usage-details/report-issue',
  getreportissuseview:
    baseURL + 'wow-screens-management/screen-usage-details/view-report',

  getrentaldetails:
    baseURL + 'wow-screens-management/screen-usage-details/rental-datails',
  getsellingdetails:
    baseURL + 'wow-screens-management/screen-usage-details/selling-datails',
  gettermsandcondition:
    baseURL + 'wow-screens-management/screen-usage-details/terms-and-condition',
  gettermsandconditionsselling:
    baseURL +
    'wow-screens-management/screen-usage-details/terms-and-condition-selling',
  gettermsandconditionrentalwavier:
    baseURL +
    'wow-screens-management/screen-usage-details/terms-and-condition-rental-wavier',
  getregularrentaldetails:
    baseURL +
    'wow-screens-management/wow-screens-management/regular-rental-details',
  getwowrentaldetails:
    baseURL +
    'wow-screens-management/wow-screens-management/wow-rental-details',
  getwowmanagercontact:
    baseURL + 'wow-screens-management/wow-screens-management/get-Wow_manager',
  get_category_access:
    baseURL + 'wow-screens-management/access-control/get-access-category',

  postusercategoryid:
    baseURL + 'wow-screens-management/access-control/user-category-id',
  postaudittrail: baseURL + 'wow-screens-management/access-control/audit-trail',
  get_category:
    baseURL + 'wow-screens-management/access-control/get-all-categories',
  getaudittrail: baseURL + 'wow-screens-management/access-control/audit-trail',
  getrentalfree: baseURL + 'wow-screens-management/rental-free/rental-free',
  ganttchart: baseURL + 'wow-screens-management/time-share/get-gantt-chart',
  getclaimrentalreward:
    baseURL + 'wow-screens-management/screen-usage-details/claim-rental-wavier',
    getclaimrentaltablenotreg:baseURL + 'wow-screens-management/screen-usage-details/claim-rental-wavier-not-reg',
    getscreenincheuasgedate:baseURL + 'wow-screens-management/screen-usage-details/get-screen-inch-usagedate',
  postclaimrental:
    baseURL + 'wow-screens-management/screen-usage-details/post-claim',
  getcliambooknewscreenuser:
    baseURL +
    'wow-screens-management/screen-usage-details/claim-buy-new-screen',

  getaudittrailclaimrentalwavier:
    baseURL +
    'wow-screens-management/screen-usage-details/audit-trail-claim-rental-wavier',
  getaudittrailtimeshareforgetsterscreen:
    baseURL + 'wow-screens-management/time-share/audit-trail-time-share',
  getaudittrailaccesscontrolwowscreens:
    baseURL +
    'wow-screens-management/access-control/audit-trail-access-control',

  // ceph_URL: 'https://cephapi.getster.tech/api/storage/',
  ceph_URL: 'https://cephapi.getwow.biz/api/storage/',
  updatepodnumber:
    baseURL + 'wow-screens-management/screen-usage-details/update-pod-number',
};
