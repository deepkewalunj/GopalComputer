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
  roles=CommonModel.getRoles();


  ngOnInit() {
  }

  createForm() {
    this.addAccessoryForm = this.fb.group({
      materialType: ['', Validators.required],
      accessoryName: ['', Validators.required]
    }
    );
  }
  close(){
    this.modelRef.close(false);
  }

  saveAccessoryData() {
    debugger;
    this.materialAccessoryService.saveAccessory(this.accessoryInputModel)
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
