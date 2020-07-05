import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModel } from 'src/app/models/common.model';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {

  constructor(private fb: FormBuilder,private userService: UserService) {
      this.createForm();

   }


  // we used reactive forms and validations
  userForm: FormGroup;
  modelRef:any;
  user:any;
  modulePermission:any;
  roles = CommonModel.getRolesExceptSuperAdmin();

  ngOnInit() {
  }

  createForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{1,}")]],
      userPassword: ['', Validators.required],
      userRole: ['', Validators.required],
      permissions: ['']
    }
    );
  }
  close(){
    this.modelRef.close(false);
}
  saveUser() {
    this.userService.SaveUserData(this.user, this.modulePermission)
      .pipe(first())
      .subscribe(
        data => {

          this.modelRef.close(true);
        },
        error => {
         console.log(error);
        });
  }

}
