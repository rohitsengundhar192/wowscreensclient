import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtauthserviceService } from './jwtauthservice.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  customer_id: any;
  country_no: any;

  private httpClient: HttpClient;

  constructor(
    private http: HttpClient,
    private handler: HttpBackend,
    private _jwtAuthService: JwtauthserviceService
  ) {
    this.getvalues();
    this.httpClient = new HttpClient(handler);
  }

  getvalues() {
    this.customer_id = localStorage.getItem('customer_id');
    this.country_no = localStorage.getItem('country_no');
  }

  // Nest JS API's of WOW Screens Management

  // ********** Time Share For WOW Screens ********** //

  // ---------- POST API ---------- //

  // Book Screen
  postbookscreen(
    country_code: string,
    customer_id: number,
    user_id: number,
    details: any
  ) {
    return this.http.post<any>(
      `${environment.postbookscreen}?country_code=${country_code}&customer_id=${customer_id}&user_id=${user_id}`,
      details
    );
  }

  // ---------- GET API ---------- //

  // Get Available Screens
  getavailablescreens(
    country_code: string,
    customer_id: number,
    start_datetime: string,
    end_datetime: string
  ) {
    return this.http.get<any>(
      `${environment.getavailablescreens}?country_code=${country_code}&customer_id=${customer_id}&start_datetime=${start_datetime}&end_datetime=${end_datetime}`
    );
  }
  getavailablescreensedit(
    country_code: string,
    customer_id: number,
    start_datetime: string,
    end_datetime: string,
    getster_screen_id: number
  ) {
    return this.http.get<any>(
      `${environment.getavailablescreensedit}?country_code=${country_code}&customer_id=${customer_id}&start_datetime=${start_datetime}&end_datetime=${end_datetime}&getster_screen_id=${getster_screen_id}`
    );
  }
  // Table View
  gettableview(
    country_code: string,
    customer_id: number,
    from_date: string,
    to_date: string,
    page_no: number,
    page_per: number
  ) {
    return this.http.get<any>(
      `${environment.gettableview}?country_code=${country_code}&customer_id=${customer_id}&from_date=${from_date}&to_date=${to_date}&page_no=${page_no}&per_page=${page_per}`
    );
  }
  // Table View
  gettableviewnormal(
    country_code: string,
    customer_id: number,
    from_date: string,
    to_date: string
  ) {
    return this.http.get<any>(
      `${environment.gettableviewnormal}?country_code=${country_code}&customer_id=${customer_id}&from_date=${from_date}&to_date=${to_date}`
    );
  }
  // ---------- PUT API ---------- //

  // Update Screen
  updatescreen(
    country_code: string,
    customer_id: number,
    app_id: number,
    details: any
  ) {
    return this.http.put<any>(
      `${environment.updatescreen}?country_code=${country_code}&customer_id=${customer_id}&app_id=${app_id}`,
      details
    );
  }

  // ********** WOW Screens Management Component ********** //

  // ---------- GET API ---------- //

  // WOW SCREENs REGISTRATION AND USAGE VALIDITY DATA
  getscreenregister(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.getscreenregister}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  getscreenregisterclaim(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.getscreenregisterclaim}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }
  // WOW SCREENs USAGE DATA
  getusagedata(screen_id: number) {
    return this.http.get<any>(
      `${environment.getusagedata}?screen_id=${screen_id}`
    );
  }
  // Rental Details
  getrentaldetails(screen_inch: number, country_code: string) {
    return this.http.get<any>(
      `${environment.getrentaldetails}?screen_size_in_inch=${screen_inch}&country_code=${country_code}`
    );
  }
  // Selling Details
  getsellingdetails(screen_inch: number, country_code: string) {
    return this.http.get<any>(
      `${environment.getsellingdetails}?screen_size_in_inch=${screen_inch}&country_code=${country_code}`
    );
  }
  // Rental Details
  getqrcodedata(screen_inch: number, country_code: string) {
    return this.http.get<any>(
      `${environment.getqrcodedata}?screen_size_in_inch=${screen_inch}&country_code=${country_code}`
    );
  }
  gettermsandcondition(screen_inch: number) {
    return this.http.get<any>(
      `${environment.gettermsandcondition}?screen_inch=${screen_inch}`
    );
  }
  gettermsandconditionselling(screen_inch: number) {
    return this.http.get<any>(
      `${environment.gettermsandconditionsselling}?screen_inch=${screen_inch}`
    );
  }
  gettermsandconditionrentalwavier(screen_inch: number) {
    return this.http.get<any>(
      `${environment.gettermsandconditionrentalwavier}?screen_inch=${screen_inch}`
    );
  }
  // getregularrentaldetails(
  //   country_code: string,
  //   customer_id: number,
  //   screen_inch: number
  // ) {
  //   return this.http.get<any>(
  //     `${environment.getregularrentaldetails}?country_code=${country_code}&customer_id=${customer_id}&screen_inch=${screen_inch}`
  //   );
  // }
  // Get WOW Rental Details
  // getwowrentaldetails(
  //   country_code: string,
  //   customer_id: number,
  //   screen_inch: number
  // ) {
  //   return this.http.get<any>(
  //     `${environment.getwowrentaldetails}?country_code=${country_code}&customer_id=${customer_id}&screen_inch=${screen_inch}`
  //   );
  // }
  getscreenincheuasgedate(getster_screen_id: number) {
    return this.http.get<any>(
      `${environment.getscreenincheuasgedate}?getster_screen_id=${getster_screen_id}`
    );
  }
  // getscreenincheuasgedate
  postpaywowrent(
    country_code: string,
    customer_id: number,
    getster_screen_id: number,
    customer_type: number,
    date_duration: number,
    details: any
  ) {
    return this.http.post<any>(
      `${environment.postpaywowrent}?country_code=${country_code}&customer_id=${customer_id}&getster_screen_id=${getster_screen_id}&customer_type=${customer_type}&date_duration=${date_duration}`,
      details
    );
  }
  postpaywowpurchase(
    country_code: string,
    customer_id: number,
    getster_screen_id: number,
    customer_type: number,
    date_duration: number,
    details: any
  ) {
    return this.http.post<any>(
      `${environment.postpaywowpurchase}?country_code=${country_code}&customer_id=${customer_id}&getster_screen_id=${getster_screen_id}&customer_type=${customer_type}&date_duration=${date_duration}`,
      details
    );
  }

  // GETster Manager Contact
  // getwowmanagercontact(country_code: string, customer_id: number) {
  //   return this.http.get<any>(
  //     `${environment.getwowmanagercontact}?country_code=${country_code}&customer_id=${customer_id}`
  //   );
  // }

  // ---------- PUT API ---------- //

  // Report Issue
  putreportissue(country_code: string, details: any) {
    return this.http.put<any>(
      `${environment.putreportissue}?country_code=${country_code}`,
      details
    );
  }

  get_category_access(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.get_category_access}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  // ********** Access control of WOW Screens ********** //

  // ---------- POST API ---------- //

  // Post User Category ID
  postusercategoryid(country_code: string, customer_id: number, details: any) {
    return this.http.post<any>(
      `${environment.postusercategoryid}?country_code=${country_code}&customer_id=${customer_id}`,
      details
    );
  }
  // Audit Trail
  postaudittrail(country_code: string, customer_id: number, details: string) {
    return this.http.post<any>(
      `${environment.postaudittrail}?country_code=${country_code}&customer_id=${customer_id}`,
      details
    );
  }

  // ---------- GET API --------- //

  // Get Tree View Categories
  get_category(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.get_category}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }
  // Get Audit Trail
  // getaudittrail(country_code: string, customer_id: number) {
  //   return this.http.get<any>(
  //     `${environment.getaudittrail}?country_code=${country_code}&customer_id=${customer_id}`
  //   );
  // }

  // ********** Free WOW Screen and WOW Educational App Usage Fee Waiver ********** //

  // ---------- GET API ---------- //
  // Get Rental Details
  // getrentalfree(country_code: string, customer_id: number, user_id: number) {
  //   return this.http.get<any>(
  //     `${environment.getrentalfree}?country_code=${country_code}&customer_id=${customer_id}&user_id=${user_id}`
  //   );
  // }
  // getwowscreendefualt(getster_screen_id: number): Observable<any> {
  //   return this.http.get<any>(
  //     `${environment.manageGetsterScreens}?getster_screen_id=${getster_screen_id}`
  //   );
  //   this._jwtAuthService.getJwtToken();
  // }

  getganttchart(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.ganttchart}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  getreportissuseview(getster_screen_id: number) {
    return this.http.get<any>(
      `${environment.getreportissuseview}?getster_screen_id=${getster_screen_id}`
    );
  }

  getclaimrentaltable(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.getclaimrentalreward}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }
  getclaimrentaltablenotreg(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.getclaimrentaltablenotreg}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  postclaimrental(
    country_code: string,
    customer_id: number,
    getster_screen_id: number,
    details: any
  ) {
    return this.http.post<any>(
      `${environment.postclaimrental}?country_code=${country_code}&customer_id=${customer_id}&getster_screen_id=${getster_screen_id}`,
      details
    );
  }

  getcliambooknewscreenuser(country_code: string, customer_id: number) {
    return this.http.get<any>(
      `${environment.getcliambooknewscreenuser}?country_code=${country_code}&customer_id=${customer_id}`
    );
  }

  updatepodnumber(
    country_code: string,
    customer_id: number,
    login_id: number,
    details: any
  ) {
    return this.http.post<any>(
      `${environment.updatepodnumber}?country_code=${country_code}&customer_id=${customer_id}&login_id=${login_id}`,
      details
    );
  }

  getaudittrailclaimrentalwavier(
    country_code: string,
    customer_id: number,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.getaudittrailclaimrentalwavier}?country_code=${country_code}&customer_id=${customer_id}&page_no=${page_no}&per_page=${per_page}`
    );
  }
  getaudittrailtimeshareforgetsterscreen(
    country_code: string,
    customer_id: number,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.getaudittrailtimeshareforgetsterscreen}?country_code=${country_code}&customer_id=${customer_id}&page_no=${page_no}&per_page=${per_page}`
    );
  }
  getaudittrailaccesscontrolwowscreens(
    country_code: string,
    customer_id: number,
    page_no: number,
    per_page: number
  ) {
    return this.http.get<any>(
      `${environment.getaudittrailaccesscontrolwowscreens}?country_code=${country_code}&customer_id=${customer_id}&page_no=${page_no}&per_page=${per_page}`
    );
  }
}
