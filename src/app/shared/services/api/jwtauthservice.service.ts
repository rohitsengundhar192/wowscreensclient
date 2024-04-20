import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtauthserviceService {
  return!: string;

  constructor(
    private route: ActivatedRoute,
    private jwtService: JwtHelperService
  ) {
    //Customer - 105 - vk - tesing
    localStorage.setItem(
      'access_token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOiI1IiwiY3VzdG9tZXJfaWQiOjEwNSwiY291bnRyeV9jb2RlIjoiaW4iLCJjdXN0b21lcl9zdWJfZG9tYWluX25hbWUiOiJ2ayIsInJlZ2lzdGVyZWRfZWR1Y2F0aW9uYWxfaW5zdGl0dXRpb25fbmFtZSI6ImN2aWNreSIsInRpbWVfem9uZV9pYW5hX3N0cmluZyI6IkFzaWEvQ2FsY3V0dGEiLCJhcHBfbmFtZSI6InZrIiwiZGVmYXVsdF9jdXJyZW5jeV9zaG9ydGZvcm0iOiJJTlIiLCJhY2NvdW50aW5nX3N0YW5kYXJkc19pZCI6bnVsbCwiaXNfZGVmYXVsdF9hY2FkZW1pY195ZWFyX2Zvcm1hdF9zcGFubmluZ190d29fY2FsZW5kYXJfeWVhcnMiOjEsImRlZmF1bHRfYWNhZGVtaWNfeWVhcl9zdGFydF9kYXRlX2FuZF9tb250aCI6IjYvMTIiLCJzb2NrZXRfaWQiOiIiLCJ1c2VyX2NhdGVnb3J5X3R5cGUiOiI0IiwiZWR1Y2F0aW9uYWxfaW5zdGl0dXRpb25fY2F0ZWdvcnlfaWQiOiI2cmNaZzFNYUVPTlZTUFoiLCJ1c2VyX3JlZ2lzdGVyZWRfY2F0ZWdvcmllc19pZHMiOiJ3M1lveEJKcFVIcFNDZHUiLCJ1c2VyX3JlZ2lzdHJhdGlvbl9sb2dpbl9hcHByb3ZhbF9zdGF0dXMiOjEsImNvdW50cnkiOiJpbiIsInBpbl9jb2RlIjoicnR5cnkiLCJzdGF0ZV9wcm92aW5jZSI6IlRhbWlsIE5hZHUiLCJjaXR5X2Rpc3RyaWN0X2NvdW50eSI6IlRpcnVwYXR0dXIiLCJhZGRyZXNzX2xpbmVfMSI6IlZhbml5YW1iYWRpIiwiYWRkcmVzc19saW5lXzIiOiJWYW5peWFtYmFkaSIsImN1c3RvbWVyX3R5cGUiOjB9LCJpYXQiOjE3MDI1MjczNzEsImV4cCI6MTg2MjUyNzM3MX0.is-E8pzP4eSESYAFiS9sUSwTimWAwyg3VXgsBkEt5LE'
    );

    //Customer - 93 - production
    // localStorage.setItem(
    //   'access_token',
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOiIxIiwiY3VzdG9tZXJfaWQiOjkzLCJjb3VudHJ5X2NvZGUiOiJpbiIsImN1c3RvbWVyX3N1Yl9kb21haW5fbmFtZSI6ImdwdGNrbG0iLCJyZWdpc3RlcmVkX2VkdWNhdGlvbmFsX2luc3RpdHV0aW9uX25hbWUiOiJnb3Zlcm5tZW50IHBvbHl0ZWNobmljIGNvbGxlZ2UiLCJ0aW1lX3pvbmVfaWFuYV9zdHJpbmciOiJBc2lhL0tvbGthdGEiLCJhcHBfbmFtZSI6ImdwdGNrbG0iLCJkZWZhdWx0X2N1cnJlbmN5X3Nob3J0Zm9ybSI6IklOUiIsImFjY291bnRpbmdfc3RhbmRhcmRzX2lkIjowLCJpc19kZWZhdWx0X2FjYWRlbWljX3llYXJfZm9ybWF0X3NwYW5uaW5nX3R3b19jYWxlbmRhcl95ZWFycyI6MSwiZGVmYXVsdF9hY2FkZW1pY195ZWFyX3N0YXJ0X2RhdGVfYW5kX21vbnRoIjoiNi83Iiwic29ja2V0X2lkIjoiIiwidXNlcl9jYXRlZ29yeV90eXBlIjoiNiw1LDQiLCJlZHVjYXRpb25hbF9pbnN0aXR1dGlvbl9jYXRlZ29yeV9pZCI6Ik15eXBPNUpMRmQyQlI1TyxqMEdVbVBpNGczd1g2V1QiLCJ1c2VyX3JlZ2lzdGVyZWRfY2F0ZWdvcmllc19pZHMiOiJqeDFEZ1hwZHNkWUhkemMsVzN2MUdMUjN4bFd4NkJBLGROdWE5NkpNTHo3UVN1byIsInVzZXJfcmVnaXN0cmF0aW9uX2xvZ2luX2FwcHJvdmFsX3N0YXR1cyI6MywiY291bnRyeSI6ImluIiwicGluX2NvZGUiOiI2MzUxMTMiLCJzdGF0ZV9wcm92aW5jZSI6IlRhbWlsIE5hZHUiLCJjaXR5X2Rpc3RyaWN0X2NvdW50eSI6IktyaXNobmFnaXJpIiwiYWRkcmVzc19saW5lXzEiOiJrZWxhbWFuZ2FsYW0iLCJhZGRyZXNzX2xpbmVfMiI6ImtlbGFtYW5nYWxhbSIsImN1c3RvbWVyX3R5cGUiOjB9LCJpYXQiOjE3MDIyOTc2NDUsImV4cCI6MTg2MjI5NzY0NX0.8LW6g6E2l77mH5L0FMht6YYZ4A3FA5GJM4F9VZZGHzI'
    // );

    //Customer - 118 - production
    // localStorage.setItem(
    //   'access_token',
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOiIxIiwiY3VzdG9tZXJfaWQiOjExOCwiY291bnRyeV9jb2RlIjoiaW4iLCJjdXN0b21lcl9zdWJfZG9tYWluX25hbWUiOiJtYWdpYyIsInJlZ2lzdGVyZWRfZWR1Y2F0aW9uYWxfaW5zdGl0dXRpb25fbmFtZSI6Im1hZ2ljIiwidGltZV96b25lX2lhbmFfc3RyaW5nIjoiQXNpYS9DYWxjdXR0YSIsImFwcF9uYW1lIjoibWFnaWMiLCJkZWZhdWx0X2N1cnJlbmN5X3Nob3J0Zm9ybSI6IklOUiIsImFjY291bnRpbmdfc3RhbmRhcmRzX2lkIjpudWxsLCJpc19kZWZhdWx0X2FjYWRlbWljX3llYXJfZm9ybWF0X3NwYW5uaW5nX3R3b19jYWxlbmRhcl95ZWFycyI6MSwiZGVmYXVsdF9hY2FkZW1pY195ZWFyX3N0YXJ0X2RhdGVfYW5kX21vbnRoIjoiMS82Iiwic29ja2V0X2lkIjoiIiwidXNlcl9jYXRlZ29yeV90eXBlIjoiNCIsImVkdWNhdGlvbmFsX2luc3RpdHV0aW9uX2NhdGVnb3J5X2lkIjoiNnJjWmcxTWFFT05WU1BaLE15eXBPNUpMRmQyQlI1TyIsInVzZXJfcmVnaXN0ZXJlZF9jYXRlZ29yaWVzX2lkcyI6InczWW94QkpwVUhwU0NkdSIsInVzZXJfcmVnaXN0cmF0aW9uX2xvZ2luX2FwcHJvdmFsX3N0YXR1cyI6MywiY291bnRyeSI6ImluIiwicGluX2NvZGUiOiI2MzU3NTIiLCJzdGF0ZV9wcm92aW5jZSI6IlRhbWlsIE5hZHUiLCJjaXR5X2Rpc3RyaWN0X2NvdW50eSI6IlRpcnVwYXR0dXIiLCJhZGRyZXNzX2xpbmVfMSI6IlZhbml5YW1iYWRpIiwiYWRkcmVzc19saW5lXzIiOiJWYW5peWFtYmFkaSIsImN1c3RvbWVyX3R5cGUiOjB9LCJpYXQiOjE3MDY1Mjk2NjgsImV4cCI6MTg2NjUyOTY2OH0.q7g1k9gz0JOytQ53XMWwN9_lirUxAqFhtgQ94iT23j0'
    // );

    this.route.queryParams.subscribe(
      (params) => (this.return = params['return'] || '/')
    );
  }

  getJwtToken() {
    let HTTP_OPTIONS = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: ('Bearer ' +
          localStorage.getItem('access_token')) as any,
      }),
    };

    return HTTP_OPTIONS;
  }

  isLoggedIn(): Boolean {
    return !!this.getJwtToken();
  }
  decodeJwtToken(jwt_token: string) {
    return this.jwtService.decodeToken(jwt_token);
  }
}
