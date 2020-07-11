import { Component, OnInit } from '@angular/core';
import { Outward } from 'src/app/models/Outward.model';
import { environment } from 'src/environments/environment';
import { QzTrayService } from 'src/app/services/qz-tray.service';
@Component({
  selector: 'app-outward-print',
  templateUrl: './outward-print.component.html',
  styleUrls: ['./outward-print.component.scss']
})
export class OutwardPrintComponent implements OnInit {

  constructor(private printService: QzTrayService) { }
  modelRef: any;
  outward: Outward;
  APIURL = environment.API_URL;
  isInwardPrinting: boolean = false;
  ngOnInit() {
  }
  close() {
    this.modelRef.close(false);
  }

}
