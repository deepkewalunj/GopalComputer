import { Component, OnInit } from '@angular/core';
import { Lumpsum } from 'src/app/models/Lumpsum.model';
import { environment } from 'src/environments/environment';
import { QzTrayService } from 'src/app/services/qz-tray.service';

@Component({
  selector: 'app-lumpsum-print',
  templateUrl: './lumpsum-print.component.html',
  styleUrls: ['./lumpsum-print.component.scss']
})
export class LumpsumPrintComponent implements OnInit {

  constructor(private printService: QzTrayService) { }
  modelRef: any;
  lumpsum: Lumpsum;
  APIURL = environment.API_URL;
  isInwardPrinting: boolean = false;
  ngOnInit() {
  }
  close() {
    this.modelRef.close(false);
  }

}
