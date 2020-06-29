import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import { UserPermission } from '../../../models/user-permission';
import { DataTableDirective } from 'angular-datatables';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';
import { CommonModel } from 'src/app/models/common.model';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})


export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  user = {
    firstName: '',
    middleName: '',
    lastName: '',
    userEmail: '',
    userPassword: '',
    userRole: null,
    userId: null
  }

  modulePermission = Array<UserPermission>();



  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};
  searchFilter: boolean;
  error = '';
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  userList = [];
  dtTrigger: Subject<any> = new Subject();

  constructor( private modalService: NgbModal, private userService: UserService
   ) {

  }




  /*on click modal will be open*/

  open(content, userId) {
    this.modalService.open(content).result.then((result) => {
      if(result==true)
      {




      }

    }, (reason) => {

    });;
  }

  openUserPopup(userId) {
    this.bindPermission();
    if (userId > 0)
    {

      this.getUsersById(userId);
    }

    else {
      this.user = {
        firstName: '',
        middleName: '',
        lastName: '',
        userEmail: '',
        userPassword: '',
        userRole: null,
        userId: null
      }

      this.openAddEditUserPopup(this.user ,this.modulePermission);


    }


  }

  openAddEditUserPopup(user,modulepermission){
    const modalRef = this.modalService.open(AddEditUserComponent, { size: 'lg' });
    modalRef.componentInstance.user=user;
    modalRef.componentInstance.modulePermission= modulepermission;
    modalRef.componentInstance.modelRef=modalRef;
    modalRef.result.then((result) => {
      if(result==true)
      {
        this._success.next("User Saved Successfully.")
        this.getUsers();
      }

    }, (reason) => {

    });
  }

  /*succes message code here*/

  ngOnInit(): void {
    const that=this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columns: [{ data: 'firstName',searchable:true,orderable:true  }, { data: 'lastName',searchable:true,orderable:true  },
      { data: 'userEmail',searchable:true,orderable:true  },{ data: 'userRole',searchable:true,orderable:true  },
      {searchable:false,orderable:false}]

    };
    this.getUsers(true);
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }



  getuserRoleName(roleId){
    if(roleId)
    {
      let lstRoles=CommonModel.getRoles();
      let roleName=lstRoles.find(role=>role.id==roleId).name;
      if(roleName)
      {
        return roleName;
      }
      else
      {
        return "";
      }
    }

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  ngAfterViewInit() {
    this.bindPermission();

  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  getUsers(first=false) {
    const that = this;
    try {
      this.userService.getUsers()
        .subscribe(
          data => {
            that.userList = data.users;
            if(first)
            {
              that.dtTrigger.next();
            }
            else
            {
              that.rerender();
            }
          },
          error => {
            that.error = error;
          });
    }
    catch (e) {

    }
  }

  getUsersById(userId) {

    this.userService.GetUserById(userId)
      .pipe(first())
      .subscribe(
        data => {
          this.user.firstName = data.user.firstName;
          this.user.middleName = data.user.middleName;
          this.user.lastName = data.user.lastName;
          this.user.userEmail = data.user.userEmail;
          this.user.userPassword = data.user.userPassword;
          this.user.userRole = String(data.user.userRole);
          this.user.userId = data.user.userId;
           if (data.userPermissions) {
            for (var i = 0; i < this.modulePermission.length; i++) {
              for (var j = 0; j < data.userPermissions.length; j++) {
                if (this.modulePermission[i].moduleName == data.userPermissions[j].moduleName) {
                  this.modulePermission[i].isChecked = true;
                }
              }
            }
          }
          this.openAddEditUserPopup(this.user ,this.modulePermission);

        },
        error => {
          this.error = error;
        });
  }



  bindPermission() {
    this.modulePermission = Array<UserPermission>();
    this.modulePermission.push({ isChecked: false, moduleId: 1, moduleName: "Master" });
    this.modulePermission.push({ isChecked: false, moduleId: 2, moduleName: "Client Master" });
    this.modulePermission.push({ isChecked: false, moduleId: 3, moduleName: "Client" });
    this.modulePermission.push({ isChecked: false, moduleId: 4, moduleName: "Inward Material" });
    this.modulePermission.push({ isChecked: false, moduleId: 5, moduleName: "Inward Master" });
    this.modulePermission.push({ isChecked: false, moduleId: 6, moduleName: "Material Type" });
    this.modulePermission.push({ isChecked: false, moduleId: 7, moduleName: "Material Company" });
    this.modulePermission.push({ isChecked: false, moduleId: 8, moduleName: "Inward Accessories" });
    this.modulePermission.push({ isChecked: false, moduleId: 9, moduleName: "Transaction" });
    this.modulePermission.push({ isChecked: false, moduleId: 10, moduleName: "Report" });
  }


  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }
  openDelete(content,userId:number) {

    const that=this;

    this.modalService.open(content).result.then((result) => {
      if(result==true)
      {


        that.deleteCustomer(userId,that);

      }

    }, (reason) => {

    });
  }

  deleteCustomer(userId:number,that){
    that.userService.deleteUser(userId).subscribe((data)=>{

        that.getUsers();
        that._success.next("Customer Deleted Successfully.");
      },(error)=>{


      })
  }

}
