import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { MustMatch } from 'src/app/services/password.match.validator';
import { first } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})

 
export class UsersListComponent implements OnInit {

  user = {
    firstName: '',
    middleName: '',
    lastName: '',
    userEmail: '',
    userPassword: '',
    userRole: null,
    userId:null
  }
  
  
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};
  searchFilter: boolean;
  error = '';
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  userList = [];
  dtTrigger: Subject<any> = new Subject();

    // we used reactive forms and validations
    userForm: FormGroup;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private userService: UserService) {
     this.createForm();
    }
  
    createForm() { 
      this.userForm = this.fb.group({
        firstName: ['', Validators.required],
        middleName: ['', Validators.required],
        lastName: ['', Validators.required],
        userEmail: ['', [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{1,}")]],
        userPassword: ['', Validators.required],
        userRole: ['', Validators.required],
      }
      );
    }


  /*on click modal will be open*/

  open(content, userId) {
    this.modalService.open(content);
  }

  openUserPopup(content, userId) {
    if (userId > 0)
      this.getUsersById(userId, content);
    else {
      this.user = {
        firstName: '',
        middleName: '',
        lastName: '',
        userEmail: '',
        userPassword: '',
        userRole: null,
        userId : null
      }
      this.modalService.open(content, { size: 'lg' });
    }
      
    
  }

   /*succes message code here*/
 
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    setTimeout(() => this.staticAlertClosed = true, 20000);
    this.getUsers();
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  getUsers() {
    this.userService.getUsers()
      .pipe(first())
      .subscribe(
        data => {
          this.userList = data.users;
          this.dtTrigger.next();
        },
        error => {
          this.error = error;
        });
  }

  getUsersById(userId, content) {
    this.userService.GetUserById(userId)
      .pipe(first())
      .subscribe(
        data => {
          this.user.firstName = data.user.firstName;
          this.user.middleName = data.user.middleName;
          this.user.lastName = data.user.lastName;
          this.user.userEmail = data.user.userEmail;
          this.user.userPassword = data.user.userPassword;
          this.user.userRole = data.user.userRole;
          this.user.userId = data.user.userId;
          this.modalService.open(content, { size: 'lg' });
        },
        error => {
          this.error = error;
        });
  }

  public changeSuccessMessage() {
    this._success.next('Record deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;    
  }

}
