import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { 
  }

// add class to login page body

  ngOnInit() {
    this.document.body.classList.add('login-page-body');
  }

  ngOnDestroy() {
    this.document.body.classList.remove('login-page-body');
  }


}

