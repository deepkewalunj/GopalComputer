import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import {WebcamModule} from 'ngx-webcam';
import { CameraComponent } from './camera/camera.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TextMaskModule,
    AngularMultiSelectModule,
    NgbModule

  ],


  exports: [
    CommonModule,

  ],




})
export class SharedModule { }
