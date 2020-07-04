import { Component, OnInit } from '@angular/core';
import { Inward, InwardListModel } from 'src/app/models/inward.model';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-inward-print',
  templateUrl: './inward-print.component.html',
  styleUrls: ['./inward-print.component.scss']
})
export class InwardPrintComponent implements OnInit {

  constructor() { }
  modelRef: any;
  inward: Inward;
  APIURL = environment.API_URL;
  ngOnInit() {
  }

}
