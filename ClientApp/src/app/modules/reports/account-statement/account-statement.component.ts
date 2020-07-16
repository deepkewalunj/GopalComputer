import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar ,NgbPeriod} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {
  searchFilter: boolean;
  
  constructor(private ngbCalendar: NgbCalendar,) { }

  ngOnInit() {
  }
    /*on click search filter hide show on mobile*/

    toggleSearch() {
      this.searchFilter = !this.searchFilter;
    }
  

}
