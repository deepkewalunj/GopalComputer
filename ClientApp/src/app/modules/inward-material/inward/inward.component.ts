
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-inward',
  templateUrl: './inward.component.html',
  styleUrls: ['./inward.component.scss']
})
export class InwardComponent implements OnInit {

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

    constructor(private fb: FormBuilder, private modalService: NgbModal) {
    }


  /*on click modal will be open*/

  open(content) {
    this.modalService.open(content);
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


