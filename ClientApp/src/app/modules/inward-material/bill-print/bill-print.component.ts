import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { environment } from 'src/environments/environment';
import { QzTrayService } from 'src/app/services/qz-tray.service';

@Component({
  selector: 'app-bill-print',
  templateUrl: './bill-print.component.html',
  styleUrls: ['./bill-print.component.scss']
})
export class BillPrintComponent implements OnInit {

  constructor(private printService: QzTrayService) { }
  modelRef: any;
  bill: Bill;
  APIURL = environment.API_URL;
  isInwardPrinting: boolean = false;
  ngOnInit() {
  }
  close() {
    this.modelRef.close(false);
  }
}
