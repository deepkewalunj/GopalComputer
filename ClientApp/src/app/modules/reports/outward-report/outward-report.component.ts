import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar ,NgbPeriod} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-outward-report',
  templateUrl: './outward-report.component.html',
  styleUrls: ['./outward-report.component.scss']
})
export class OutwardReportComponent implements OnInit {
  searchFilter: boolean;
  searchForm: FormGroup;
  constructor(private ngbCalendar: NgbCalendar) { }

  ngOnInit() {
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }

}
