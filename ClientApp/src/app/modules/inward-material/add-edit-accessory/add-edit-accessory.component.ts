import { Component, OnInit } from '@angular/core';
import { MaterialAccessoryService } from 'src/app/services/material-accessory.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModel } from 'src/app/models/common.model';
import { AccessoryInputModel } from 'src/app/models/AccessoryInputModel';
@Component({
  selector: 'app-add-edit-accessory',
  templateUrl: './add-edit-accessory.component.html',
  styleUrls: ['./add-edit-accessory.component.scss']
})
export class AddEditAccessoryComponent implements OnInit {

  constructor(private fb: FormBuilder,private materialAccessoryService: MaterialAccessoryService) {
    this.createForm();

 }

  addAccessoryForm: FormGroup;
  modelRef:any;
  accessoryInputModel:AccessoryInputModel;
  roles = CommonModel.getRoles();
  errorMessage: String;

  ngOnInit() {
  }

  createForm() {
    this.addAccessoryForm = this.fb.group({
      materialType: ['', Validators.required],
      accessoryName: ['', Validators.required]
    }
    );
  }
  close() {
    this.errorMessage = "";
    this.modelRef.close(false);
  }

  saveAccessoryData() {
    this.errorMessage = "";
    this.materialAccessoryService.saveAccessory(this.accessoryInputModel)
      .pipe(first())
      .subscribe(
        data => {
          if (data.result == 'ALREADY_EXIST') {
            this.errorMessage = "Record already exist, Please try another one.";
          }
          else if (data.result == 'UPDATED') {
            this.modelRef.close(true);
          }
          else if (data.result == 'INSERTED') {
            this.modelRef.close(true);
          }
          else if (data.result == 'ERROR') {
            this.errorMessage = "Something went wrong.";
          }
          else
          {
            this.errorMessage = "Something went wrong.";
          }
        },
        error => {
         console.log(error);
        });
  }
}
