import { Component, OnInit } from '@angular/core';
import { SearchModelNoMaterialTypeCompanyNameService } from 'src/app/services/search-model-no-material-type-company-name.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModel } from 'src/app/models/common.model';
import { tblSearchModelNoMaterialTypeCompanyName } from 'src/app/models/tblSearchModelNoMaterialTypeCompanyName';

@Component({
  selector: 'app-add-update-model-no-material-type',
  templateUrl: './add-update-model-no-material-type.component.html',
  styleUrls: ['./add-update-model-no-material-type.component.scss']
})
export class AddUpdateModelNoMaterialTypeComponent implements OnInit {

  constructor(private fb: FormBuilder,private searchModelNoMaterialTypeCompanyNameService: SearchModelNoMaterialTypeCompanyNameService) {
    this.createForm();

 }

 addMaterialTypeForm: FormGroup;
  modelRef:any;
  searchModelNoMaterialTypeCompanyName:tblSearchModelNoMaterialTypeCompanyName;
  modulePermission:any;
  roles = CommonModel.getRoles();
  errorMessage : String;

  ngOnInit() {
  }

  createForm() {
    this.addMaterialTypeForm = this.fb.group({
      modelNo: ['', Validators.required],
      materialType: ['', Validators.required],
      companyName: ['', Validators.required]
    }
    );
  }
  close() {
    this.errorMessage = "";
    this.modelRef.close(false);
}
saveMaterialData() {
  this.errorMessage = "";
  this.searchModelNoMaterialTypeCompanyNameService.SaveSearchModelNoMaterialTypeCompanyNameData(this.searchModelNoMaterialTypeCompanyName)
    .pipe(first())
    .subscribe(
      data => {
        if (data.materialTypeDetail == 'ALREADY_EXIST') {
          this.errorMessage = "Record already exist, Please try another one.";
        }
        else if (data.materialTypeDetail == 'UPDATED') {
          this.modelRef.close(true);
        }
        else if (data.materialTypeDetail == 'INSERTED') {
          this.modelRef.close(true);
        }
        else if (data.materialTypeDetail == 'ERROR') {
          this.errorMessage = "Something went wrong.";
        }
        else {
          this.errorMessage = "Something went wrong.";
        }
      },
      error => {
       console.log(error);
      });
}

}
