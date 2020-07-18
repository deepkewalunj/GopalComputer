import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FormGroup,  FormBuilder, Validators, ReactiveFormsModule,  FormArray, FormControl } from '@angular/forms';
import { MustMatch } from 'src/app/services/password.match.validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // we used reactive forms and validations
  loginForm: FormGroup;
  error = '';
  submitClick = false;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
  
  }

  
// add class to login page body

  ngOnInit() {
    this.loginForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{1,}")]],
      userPassword: ['', [Validators.required]],
    }
    );
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = 'inward-material/inward' || '/';

    this.document.body.classList.add('login-page-body');
  }

  // convenience getter for easy access to form fields
  get formData() { return this.loginForm.controls; }

  onLogin() {

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.submitClick = true;
    this.authenticationService.login(this.formData.userEmail.value, this.formData.userPassword.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.submitClick = false;
        });
  }


  ngOnDestroy() {
    this.document.body.classList.remove('login-page-body');
  }

}
