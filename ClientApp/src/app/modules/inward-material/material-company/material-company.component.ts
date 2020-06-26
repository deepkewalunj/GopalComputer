
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-material-company',
  templateUrl: './material-company.component.html',
  styleUrls: ['./material-company.component.scss']
})
export class MaterialCompanyComponent implements OnInit {

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

    // we used reactive forms and validations
    addMaterialCompanyForm: FormGroup;
    constructor(private fb: FormBuilder, private modalService: NgbModal) {
     this.createForm();
    }
  
    createForm() { 
      this.addMaterialCompanyForm = this.fb.group({
        materialCompany: ['', Validators.required],
      },
     
      );
    }


  /*on click modal will be open*/

  open(content) {
    this.modalService.open(content);
  }

  addClientPopup(content) {
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

