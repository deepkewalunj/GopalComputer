import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { MustMatch } from 'src/app/services/password.match.validator';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

    // we used reactive forms and validations
    userForm: FormGroup;
    constructor(private fb: FormBuilder, private modalService: NgbModal) {
     this.createForm();
    }
  
    createForm() { 
      this.userForm = this.fb.group({
        userName:      ['', Validators.required],
        primaryEmail: ['', [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{1,}")]],
        newPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,128}')]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      }
      );
    }


  /*on click modal will be open*/

  open(content) {
    this.modalService.open(content);
  }

  openUserPopup(content) {
    this.modalService.open(content, { size: 'lg' });
  }

   /*succes message code here*/
 
  ngOnInit(): void {
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  public changeSuccessMessage() {
    this._success.next('Record deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;    
  }

}
