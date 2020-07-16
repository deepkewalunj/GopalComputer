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
  isOutwardPrinting: boolean = false;
  ngOnInit() {
  }
  close() {
    this.modelRef.close(false);
  }


  
  getTotalSum() {
    return this.outward.paidImmediatlyAmount + this.outward.outstandingAmount;
  }

  toDataUrl(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


  getBase64EncodedImage() {
    const that = this;
    that.isOutwardPrinting = true;
    that.toDataUrl(environment.API_URL + 'PDF/PrintOutward?outwardId=' + this.outward.outwardId, function (base64Image) {
      base64Image = base64Image.split(",")[1];
      that.printOutward(base64Image, that);

    });

  }
  printOutward(base64Data, that) {

    var printData = [
      {
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data: base64Data

      }
    ];

    that.printService.printData(this.outward.normalPrinterName, printData).subscribe(data => {
      that.isOutwardPrinting = false;
      console.log(data);
    }, error => {
      that.isOutwardPrinting = false;
      console.log(error);
    });

  }
}
