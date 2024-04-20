import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormControl,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription, Observable } from 'rxjs';
import { AuditTrailDialogueComponent } from 'src/app/shared/dialogs/audit-trail-dialogue/audit-trail-dialogue.component';
import { DataSharingService } from 'src/app/shared/services/data-sharing/data-sharing.service';
import { HeaderTitleService } from 'src/app/shared/services/header-title/header-title.service';
declare var GoogleTranslate: Function;

@Component({
  selector: 'app-launch-screen-app',
  templateUrl: './launch-screen-app.component.html',
  styleUrls: ['./launch-screen-app.component.scss'],
})
export class LaunchScreenAppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  headerTitle$!: Subscription;
  getsterAccessControlForm: UntypedFormGroup = new UntypedFormGroup({});
  tabName: string = 'Table';

  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  firstFormGroup!: UntypedFormGroup;
  formvalue: any;
  showTranslate: boolean = true;
  audit_trail_btn_state!: boolean;
  audit_trail$!: Observable<any>;
  audit_trail_type!: string;
  menuName: any;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private _headerTitle: HeaderTitleService,
    private _formBuilder: UntypedFormBuilder,
    private _dataSharingService: DataSharingService,
    media: MediaMatcher
  ) {
    this.firstFormGroup = this._formBuilder.group({
      languageControl: [''],
    });
    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => _cdRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  show!: boolean;

  ngOnInit(): void {
    this.sidenav;

    setTimeout(() => {
      this._dataSharingService.layout_data.subscribe((res: boolean) => {
        this.show = res;
      });
    }, 0);

    this._dataSharingService.audit_trail_data.subscribe(
      (isaudittrailenable) => {
        setTimeout(() => {
          if (isaudittrailenable) {
            this.audit_trail_btn_state = false;
          } else {
            this.audit_trail_btn_state = true;
          }
        }, 0);
      }
    );

    this.headerTitle$ = this._headerTitle.title.subscribe((title) => {
      setTimeout(() => {
        this.menuName = title;
      }, 0);
    });
  }

  stopClose($event: any) {
    $event.stopPropagation();
  }

  sideOnclickClose() {
    if (this.sidenav.mode == 'side') {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }

  menu = [
    {
      label: 'Time Share for GETster Screens',
      link: '/launch-screen/time-share-for-getster-screen',
    },
    {
      label: 'GETster Screens Usage Data',
      link: '/launch-screen/getster-screen-usage-data',
    },
    {
      label: 'Claim Rental Waiver / Rent / Purchase GETster Screen',
      link: '/launch-screen/claim-rent-purchase-getster-screen',
    },
    {
      label: 'Provide Proof of Delivery for GETster Screens',
      link: '/launch-screen/provide-proof-of-delivery',
    },
    {
      label: 'Access control of GETster Screens',
      link: '/launch-screen/access-control-of-getster-screens',
    },
    // {
    //   label: 'table-only',
    //   link: '/launch-screen/table-only',
    // },
  ];

  getName(data: any) {
    this.menuName = data;
  }

  openAuditTrail() {
    let config: MatDialogConfig = {
      disableClose: true,
      minWidth: '400px',
    };

    console.log('work');

    const auditTrailDialog = this.dialog.open(
      AuditTrailDialogueComponent,
      config
    );
  }

  ngOnDestroy(): void {
    if (this.headerTitle$) {
      this.headerTitle$.unsubscribe();
    }
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  get writer(): FormControl | any {
    return this.firstFormGroup.get('languageControl');
  }

  onlanguagechange() {
    console.log(this.writer.value);
    this.formvalue = this.writer.value;
    localStorage.setItem('googleTranslate', this.formvalue);
    GoogleTranslate();
  }

  showbtn() {
    this.showTranslate = !this.showTranslate;
  }

  googleLanguage: lang[] = [
    {
      value: 'af',
      label: 'Afrikaans',
    },
    {
      value: 'sq',
      label: 'Albanian',
    },
    {
      value: 'ar',
      label: 'Arabic',
    },
    {
      value: 'az',
      label: 'Azerbaijani',
    },
    {
      value: 'eu',
      label: 'Basque',
    },
    {
      value: 'bn',
      label: 'Bengali',
    },
    {
      value: 'be',
      label: 'Belarusian',
    },
    {
      value: 'bg',
      label: 'Bulgarian',
    },
    {
      value: 'ca',
      label: 'Catalan',
    },
    {
      value: 'zh-CN',
      label: 'Chinese Simplified',
    },
    {
      value: 'zh-TW',
      label: 'Chinese Traditional',
    },
    {
      value: 'hr',
      label: 'Croatian',
    },
    {
      value: 'cs',
      label: 'Czech',
    },
    {
      value: 'da',
      label: 'Danish',
    },
    {
      value: 'nl',
      label: 'Dutch',
    },
    {
      value: 'en',
      label: 'English',
    },
    {
      value: 'eo',
      label: 'Esperanto',
    },
    {
      value: 'et',
      label: 'Estonian',
    },
    {
      value: 'tl',
      label: 'Filipino',
    },
    {
      value: 'fi',
      label: 'Finnish',
    },
    {
      value: 'fr',
      label: 'French',
    },
    {
      value: 'gl',
      label: 'Galician',
    },
    {
      value: 'ka',
      label: 'Georgian',
    },
    {
      value: 'de',
      label: 'German',
    },
    {
      value: 'el',
      label: 'Greek',
    },
    {
      value: 'gu',
      label: 'Gujarati',
    },
    {
      value: 'ht',
      label: 'Haitian Creole',
    },
    {
      value: 'iw',
      label: 'Hebrew',
    },
    {
      value: 'hi',
      label: 'Hindi',
    },
    {
      value: 'hu',
      label: 'Hungarian',
    },
    {
      value: 'is',
      label: 'Icelandic',
    },
    {
      value: 'id',
      label: 'Indonesian',
    },
    {
      value: 'ga',
      label: 'Irish',
    },
    {
      value: 'it',
      label: 'Italian',
    },
    {
      value: 'ja',
      label: 'Japanese',
    },
    {
      value: 'kn',
      label: 'Kannada',
    },
    {
      value: 'ko',
      label: 'Korean',
    },
    {
      value: 'la',
      label: 'Latin',
    },
    {
      value: 'lv',
      label: 'Latvian',
    },
    {
      value: 'lt',
      label: 'Lithuanian',
    },
    {
      value: 'mk',
      label: 'Macedonian',
    },
    {
      value: 'ms',
      label: 'Malay',
    },
    {
      value: 'mt',
      label: 'Maltese',
    },
    {
      value: 'no',
      label: 'Norwegian',
    },
    {
      value: 'fa',
      label: 'Persian',
    },
    {
      value: 'pl',
      label: 'Polish',
    },
    {
      value: 'pt',
      label: 'Portuguese',
    },
    {
      value: 'ro',
      label: 'Romanian',
    },
    {
      value: 'ru',
      label: 'Russian',
    },
    {
      value: 'sr',
      label: 'Serbian',
    },
    {
      value: 'sk',
      label: 'Slovak',
    },
    {
      value: 'sl',
      label: 'Slovenian',
    },
    {
      value: 'es',
      label: 'Spanish',
    },
    {
      value: 'sw',
      label: 'Swahili',
    },
    {
      value: 'sv',
      label: 'Swedish',
    },
    {
      value: 'ta',
      label: 'Tamil',
    },
    {
      value: 'te',
      label: 'Telugu',
    },
    {
      value: 'th',
      label: 'Thai',
    },
    {
      value: 'tr',
      label: 'Turkish',
    },
    {
      value: 'uk',
      label: 'Ukrainian',
    },
    {
      value: 'ur',
      label: 'Urdu',
    },
    {
      value: 'vi',
      label: 'Vietnamese',
    },
    {
      value: 'cy',
      label: 'Welsh',
    },
    {
      value: 'yi',
      label: 'Yiddish',
    },
  ];
}

interface lang {
  value: string;
  label: string;
}
