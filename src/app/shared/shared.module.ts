import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { LoginComponent } from './dialogs/login/login.component';
import { NoInternetComponent } from './dialogs/no-internet/no-internet.component';
import { UnsavedChangesGuard } from './guards/unsaved-changes/unsaved-changes.guard';
import { MaterialModule } from './material.module';
import { EllipsisPipe } from './pipes/ellipsis/ellipsis.pipe';
import { NoSanitizePipe } from './pipes/no-sanitize/no-sanitize.pipe';
import { SpinnerComponent } from './services/custom-spinner/spinner.component';
import { AddAllToPaginator } from './directives/add-all-to-paginator/add-all-to-paginator.directive';

const BASE_MODULES = [FormsModule, ReactiveFormsModule, MaterialModule];

const Guards = [UnsavedChangesGuard];

const Pipes = [EllipsisPipe, NoSanitizePipe];

const Directives = [AddAllToPaginator];
@NgModule({
  declarations: [
    Pipes,
    Directives,
    LoginComponent,
    SpinnerComponent,
    NoInternetComponent,
  ],
  imports: [CommonModule, RouterModule, BASE_MODULES],
  providers: [Guards],
  exports: [Pipes, Directives, BASE_MODULES],
})
export class SharedModule {}
