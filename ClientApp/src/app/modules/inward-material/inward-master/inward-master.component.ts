
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
@Component({
  selector: 'app-inward-master',
  templateUrl: './inward-master.component.html',
  styleUrls: ['./inward-master.component.scss']
})
export class InwardMasterComponent implements OnInit {

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

    // we used reactive forms and validations
    addClientForm: FormGroup;
    constructor(private fb: FormBuilder, private modalService: NgbModal) {
     this.createForm();
    }
  
    createForm() { 
      this.addClientForm = this.fb.group({
        title:      ['', Validators.required],
      personName: ['', Validators.required],
      companyName:          ['', Validators.required],
      phoneNo: ['', Validators.required],
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

